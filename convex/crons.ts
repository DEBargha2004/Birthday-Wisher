import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.cron('Making wish to users', '0 0 * * *', internal.wishes.makeWish, {})

export default crons
