import { v } from 'convex/values'
import {
  action,
  internalAction,
  internalMutation,
  mutation,
  query
} from './_generated/server'
import { format } from 'date-fns'
import _ from 'lodash'
import { Resend } from 'resend'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { api, internal } from './_generated/api'
import {
  wishTemplateForNoUserPrompt,
  wishTemplateForUserPrompt
} from '../src/lib/templates'

export const getWishes = query({
  args: {
    user_id: v.string()
  },
  async handler (ctx, args) {
    const wishes = await ctx.db
      .query('wishes')
      .filter(q => q.eq(q.field('creator_id'), args.user_id))
      .collect()

    return wishes
  }
})

export const createWish = mutation({
  args: {
    creator_id: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    dob: v.string(),
    message: v.string(),
    phone: v.number(),
    birthday: v.string(),
    email: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('wishes', {
      creator_id: args.creator_id,
      firstname: args.firstname,
      lastname: args.lastname,
      birthday: args.birthday,
      dob: args.dob,
      message: args.message,
      phone: args.phone,
      email: args.email
    })
  }
})

export const checkWish = mutation({
  args: {
    whatsapp: v.number()
  },
  handler: async (ctx, args) => {
    const wish = await ctx.db
      .query('wishes')
      .filter(q => q.eq(q.field('phone'), args.whatsapp))
      .first()
    return wish
  }
})

export const getWishesOfDay = mutation({
  args: {
    date: v.string()
  },
  handler: async (ctx, args) => {
    const wishes = await ctx.db
      .query('wishes')
      .filter(q => q.eq(q.field('birthday'), args.date))
      .collect()
    return wishes
  }
})

export const updateLastWished = mutation({
  args: {
    wish_id: v.id('wishes'),
    last_wished: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.wish_id, {
      last_wished: args.last_wished
    })
  }
})

export const makeWish = internalAction({
  handler: async (ctx, args) => {
    const timestamp = new Date()
    const date = format(timestamp, 'dd MMM')

    let wishes = await ctx.runMutation(api.wishes.getWishesOfDay, {
      date
    })
    const uniq_creators_wish = _.uniqBy(wishes, 'creator_id')

    const uniq_creators_id = uniq_creators_wish.map(w => w.creator_id)

    const uniq_creators_info = await Promise.all(
      uniq_creators_id.map(async id => {
        const user = await ctx.runMutation(api.users.getUser, {
          id: id
        })
        return {
          user_info: user
        }
      })
    )
    const all_wishes = uniq_creators_info.map(user => {
      let user_wishes = wishes.filter(
        w => w.creator_id === user.user_info?.user_id
      )
      return {
        user,
        wishes: user_wishes
      }
    })

    await Promise.all(
      all_wishes.map(async w => {
        const resend = new Resend(w.user.user_info?.resend_api_key)
        if (w.user.user_info?.email && w.user.user_info?.resend_api_key) {
          await Promise.all(
            w.wishes.map(async uw => {
              if (uw.email) {
                const x = await resend.emails.send({
                  from: 'Acme <onboarding@resend.dev>',
                  to: uw.email,
                  subject: 'Birthday Wish',
                  html: `<p style="white-space: pre-wrap">${
                    uw.message ||
                    `Happy Birthday ${uw.firstname} from ${w.user.user_info?.firstname}`
                  }</p>`
                })
                console.log(x)
                if (!x.error) {
                  const wished_timestamp = format(
                    new Date(),
                    'dd/MM/yyyy HH:mm:ss'
                  )
                  await ctx.runMutation(api.wishes.updateLastWished, {
                    wish_id: uw._id,
                    last_wished: wished_timestamp
                  })
                }

                console.log(uw)
              }
            })
          )
        }
      })
    )
    // // console.log(all_wishes)
    // return all_wishes
  }
})

export const deleteWish = mutation({
  args: {
    wish_id: v.id('wishes')
  },
  async handler (ctx, args) {
    await ctx.db.delete(args.wish_id)
  }
})

export const getWish = mutation({
  args: {
    wish_id: v.id('wishes')
  },
  async handler (ctx, args) {
    // console.log(args)
    const wish = await ctx.db
      .query('wishes')
      .filter(q => q.eq(q.field('_id'), args.wish_id))
      .first()
    return wish
  }
})

export const updateWish = mutation({
  args: {
    wish_id: v.id('wishes'),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    message: v.optional(v.string()),
    phone: v.optional(v.number()),
    email: v.optional(v.string()),
    dob: v.optional(v.string()),
    birthday: v.optional(v.string())
  },
  async handler (ctx, args) {
    await ctx.db.patch(args.wish_id, {
      ...(args.firstName ? { firstname: args.firstName } : {}),
      ...(args.lastName ? { lastname: args.lastName } : {}),
      ...(args.message ? { message: args.message } : {}),
      ...(args.phone ? { phone: args.phone } : {}),
      ...(args.email ? { email: args.email } : {}),
      ...(args.dob ? { dob: args.dob } : {}),
      ...(args.birthday ? { birthday: args.birthday } : {})
    })
  }
})

export const checkWishWithId = mutation({
  args: {
    id: v.id('wishes')
  },
  async handler (ctx, args) {
    const wish = await ctx.db
      .query('wishes')
      .filter(q => q.eq(q.field('_id'), args.id))
      .first()
    return wish
  }
})

export const generateWishMessage = action({
  args: {
    prompt: v.optional(v.string()),
    id: v.string(),
    user_name: v.string(),
    dob: v.string()
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean
    title?: string
    description?: string
    message?: string
  }> => {
    if (args.id) {
      const res = await ctx.runMutation(api.users.getUser, {
        id: args.id
      })

      if (res?.genai_api_key) {
        const genAI = new GoogleGenerativeAI(res.genai_api_key)
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

        const result = await model.generateContent(
          args.prompt
            ? wishTemplateForUserPrompt(
                args.user_name,
                args.prompt,
                args.dob,
                res.firstname
              )
            : wishTemplateForNoUserPrompt(
                args.user_name,
                args.dob,
                res.firstname
              )
        )
        const response = result.response
        const text = response.text()

        return {
          success: true,
          title: 'Wish Generated',
          description: 'Wish Generated Successfully',
          message: text
        }
      } else {
        return {
          success: false,
          title: 'API Key Not Found',
          description: 'Gen AI API key not found. Please add it in your profile'
        }
      }
    } else {
      return {
        success: false,
        title: 'User Not Found',
        description: 'Please login again or refresh the page'
      }
    }
  }
})
