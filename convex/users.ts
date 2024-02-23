import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const createUser = mutation({
  args: {
    user_id: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    email: v.string()
    // whatsapp: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('users', {
      user_id: args.user_id,
      firstname: args.firstname,
      lastname: args.lastname,
      email: args.email
      //   whatsapp: args.whatsapp
    })
  }
})

export const getUser = mutation({
  args: {
    id: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('user_id'), args.id))
      .first()
    return user
  }
})
