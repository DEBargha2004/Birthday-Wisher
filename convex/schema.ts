import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    user_id: v.string(),
    firstname: v.string(),
    lastname: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.number()),
    resend_api_key: v.optional(v.string()),
    genai_api_key: v.optional(v.string())
  }),
  wishes: defineTable({
    creator_id: v.string(),
    firstname: v.string(),
    lastname: v.optional(v.string()),
    birthday: v.string(),
    dob: v.string(),
    message: v.optional(v.string()),
    phone: v.number(),
    last_wished: v.optional(v.string()),
    email: v.optional(v.string())
  }).index('by_birthday', ['birthday'])
})
