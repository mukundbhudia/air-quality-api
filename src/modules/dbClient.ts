import redis from 'redis'
import { initLogger } from './logger'
initLogger()

let client: any
const REDIS_PORT: number = parseInt(process.env.REDIS_URL) || 6379

export const connectDB = async (): Promise<any> => {
  try {
    client = redis.createClient(REDIS_PORT)
  } catch (error) {
    console.error(error)
    // logger.error(error)
  }
}

export const getClient = (): any => client

