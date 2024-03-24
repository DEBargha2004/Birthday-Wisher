import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const createUser = mutation({
  args: {
    user_id: v.string(),
    firstname: v.string(),
    lastname: v.string(),
    email: v.string(),
    phone: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('users', {
      user_id: args.user_id,
      firstname: args.firstname,
      lastname: args.lastname,
      email: args.email,
      phone: args.phone
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

export const updateUser = mutation({
  args: {
    user_id: v.string(),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.number()),
    resend_api_key: v.optional(v.string())
  },
  async handler (ctx, args) {
    const userDoc = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('user_id'), args.user_id))
      .first()

    if (userDoc) {
      await ctx.db.patch(userDoc._id, {
        ...args
      })

      return true
    }
  }
})
