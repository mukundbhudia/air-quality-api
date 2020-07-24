import axios from 'axios'
import { promisify } from 'util'
import { connectDB, getClient } from './dbClient'
import { initLogger } from './logger'

initLogger()
connectDB()

const client = getClient()
const getAsync = promisify(client.get).bind(client)
const CACHE_TTL: number = 60 * 60   // Time in seconds key lives in cache

client.set('server-timestamp', new Date())

export const homeRoot = async () => {
  const timeStamp = await getAsync('server-timestamp')
  return timeStamp
}

export const keyWordSearch = async (keyword) => {
  try {
    const response = await axios.get('https://api.waqi.info/search/', {
      params: {
        token: process.env.API_TOKEN,
        keyword
      }
    })
    client.setex(`qk_${keyword}`, CACHE_TTL, JSON.stringify(response.data.data))
    return response && response.data && response.data.data
  } catch (error) {
    console.error(error)
    return error
  }
}