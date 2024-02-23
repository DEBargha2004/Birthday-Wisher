import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    user_id: v.string(),
    firstname: v.string(),
    lastname: v.optional(v.string()),
    email: v.string(),
    whatsapp: v.optional(v.number())
  }),
  wishes: defineTable({
    creator_id: v.string(),
    firstname: v.string(),
    lastname: v.optional(v.string()),
    birthday: v.string(),
    dob: v.string(),
    message: v.optional(v.string()),
    whatsapp: v.number(),
    last_wished: v.optional(v.string())
  }).index('by_birthday', ['birthday'])
})
