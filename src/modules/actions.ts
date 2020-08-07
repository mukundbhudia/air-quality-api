import axios from 'axios'
import { promisify } from 'util'
import { connectDB, getClient } from './dbClient'
import logger, { initLogger } from './logger'

initLogger()
connectDB()

const client = getClient()
const getAsync = promisify(client.get).bind(client)
const CACHE_TTL: number = 60 * 60   // Time in seconds key lives in cache
const ERROR_API_GET = { 'err': 'Error retrieving data from API.' }

client.set('server-timestamp', new Date())

export const homeRoot = async (): Promise<any> => {
  const timeStamp = await getAsync('server-timestamp')
  return timeStamp
}

export const keyWordSearch = async (keyword: string): Promise<any> => {
  try {
    const response = await axios.get('https://api.waqi.info/search/', {
      params: {
        token: process.env.API_TOKEN,
        keyword
      }
    })
    logger.http(`Fetching 'keyWordSearch' with keyword: '${keyword}' from API`)
    if (response && response.data && response.data.status === 'ok') {
      client.setex(`qk_${keyword}`, CACHE_TTL, JSON.stringify(response.data.data))
      return response && response.data && response.data.data
    } else {
      return ERROR_API_GET
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

export const getMultipleStationData = async (stationIds: Array<string>): Promise<any> => {
  let allStations: Array<string> = []

  try {
    for (const stnId of stationIds) {
      const stationData = await getAsync(`stn_${stnId}`)
      if (stationData) {
        logger.debug(`Serving 'getStation' with stnId: '${stnId}' from cache`)
        allStations.push(JSON.parse(stationData))
      } else {
        allStations.push(await getStationData(stnId))
      }
    }

    if (allStations && allStations.length > 0) {
      return allStations
    } else {
      return ERROR_API_GET
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

export const getStationData = async (stnId: string): Promise<any> => {
  try {
    const response = await axios.get(`https://api.waqi.info/feed/@${stnId}/`, {
      params: {
        token: process.env.API_TOKEN,
      }
    })
    logger.http(`Fetching 'getStationData' with stnId: '${stnId}' from API`)
    if (response && response.data && response.data.status === 'ok') {
      client.setex(`stn_${stnId}`, CACHE_TTL, JSON.stringify(response.data.data))
      return response && response.data && response.data.data
    } else {
      return ERROR_API_GET
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

export const getNearestStationData = async (lat: number, lng: number): Promise<any> => {
  try {
    const response = await axios.get(`https://api.waqi.info/feed/geo:${lat};${lng}/`, {
      params: {
        token: process.env.API_TOKEN,
      }
    })
    logger.http(`Fetching 'getNearestStationData' with lat: ${lat}, lng:${lng} from API`)
    if (response && response.data && response.data.status === 'ok') {
      client.setex(`stn-nr_${lat}-${lng}`, CACHE_TTL, JSON.stringify(response.data.data))
      return response && response.data && response.data.data
    } else {
      return ERROR_API_GET
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

export const getStationsInBoundsData = async (ul_lat: number, ul_lng: number, lr_lat: number, lr_lng: number): Promise<any> => {
  try {
    const response = await axios.get(`https://api.waqi.info/map/bounds/`, {
      params: {
        token: process.env.API_TOKEN,
        latlng: `${ul_lat},${ul_lng},${lr_lat},${lr_lng}`
      }
    })
    logger.http("Fetching 'getStationsInBoundsData' with bounds: ${ul_lat}-${ul_lng}-${lr_lat}-${lr_lng} from API")
    if (response && response.data && response.data.status === 'ok') {
      client.setex(`stn-bnd_${ul_lat}-${ul_lng}-${lr_lat}-${lr_lng}`, CACHE_TTL, JSON.stringify(response.data.data))
      return response && response.data && response.data.data
    } else {
      return ERROR_API_GET
    }
  } catch (error) {
    console.error(error)
    return error
  }
}
