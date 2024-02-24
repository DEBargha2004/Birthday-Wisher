import { v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
import { format } from 'date-fns'
import _ from 'lodash'

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
    dob: v.number(),
    message: v.string(),
    whatsapp: v.number()
  },
  handler: async (ctx, args) => {
    const birthday_formatted = format(args.dob, 'dd MMM')
    const dob_formatted = format(args.dob, 'dd MMM yyyy')

    await ctx.db.insert('wishes', {
      creator_id: args.creator_id,
      firstname: args.firstname,
      lastname: args.lastname,
      birthday: birthday_formatted,
      dob: dob_formatted,
      message: args.message,
      whatsapp: args.whatsapp
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
      .filter(q => q.eq(q.field('whatsapp'), args.whatsapp))
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

    console.log(all_wishes)
    return all_wishes
  }
})
