import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { format } from 'date-fns'

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
