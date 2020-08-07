import redis from 'redis'
import logger from './logger'

let client: any
const REDIS_URL: string | number = process.env.REDIS_URL || 6379

export const connectDB = async (): Promise<any> => {
  try {
    client = redis.createClient(REDIS_URL)
  } catch (error) {
    console.error(error)
    logger.error(error)
    process.exit(1)
  }
}

export const getClient = (): any => client
