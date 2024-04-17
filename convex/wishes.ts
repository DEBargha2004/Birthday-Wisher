import { v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
import { format } from 'date-fns'
import _ from 'lodash'
import { Resend } from 'resend'

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

export const makeWish = internalMutation({
  handler: async (ctx, args) => {
    const timestamp = new Date().getTime()
    const date = format(timestamp, 'dd MMM')
    let wishes = await ctx.db
      .query('wishes')
      .filter(q => q.eq(q.field('birthday'), date))
      .collect()
    const uniq_creators_wish = _.uniqBy(wishes, 'creator_id')

    const uniq_creators_id = uniq_creators_wish.map(w => w.creator_id)

    const uniq_creators_info = await Promise.all(
      uniq_creators_id.map(async id => {
        const user = await ctx.db
          .query('users')
          .filter(q => q.eq(q.field('user_id'), id))
          .first()
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

    all_wishes.map(w => {
      const resend = new Resend(w.user.user_info?.resend_api_key)
      if (w.user.user_info?.email && w.user.user_info?.resend_api_key) {
        w.wishes.map(async uw => {
          if (uw.email) {
            await resend.emails.send({
              from: w.user.user_info!.email,
              to: uw.email,
              subject: 'Birthday Wish',
              html: `<p>${
                uw.message ||
                `Happy Birthday ${uw.firstname} from ${w.user.user_info?.firstname}`
              }</p>`
            })

            await ctx.db.patch(uw._id, {
              last_wished: format(timestamp, 'dd MMM')
            })
          }
        })
      }
    })
    console.log(all_wishes)
    return all_wishes
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
    console.log(args)
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
