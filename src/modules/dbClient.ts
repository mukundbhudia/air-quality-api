import redis from 'redis'
import { promisify } from 'util'
import { initLogger } from './logger'
initLogger()

let client
const PORT = process.env.REDIS_URL || 6379

export const connectDB = async (): Promise<any> => {
  try {
    client = redis.createClient(PORT)
  } catch (error) {
    console.error(error)
    // logger.error(error)
  }
}

export const getClient = (): any => client

export const getAsync = async (key) => {
  return await promisify(client.get).bind(client)
}
