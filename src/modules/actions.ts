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

    if (response && response.data && response.data.status === 'ok') {
      client.setex(`qk_${keyword}`, CACHE_TTL, JSON.stringify(response.data.data))
      return response && response.data && response.data.data
    } else {
      return 'Error retrieving data from API.'
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
      const stationData = await getStationData(stnId)
      allStations.push(stationData)
    }

    if (allStations && allStations.length > 0) {
      client.setex(`mult_stn_${stationIds.join('-')}`, CACHE_TTL, JSON.stringify(allStations))
      return allStations
    } else {
      return 'Error retrieving data from API.'
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

    if (response && response.data && response.data.status === 'ok') {
      client.setex(`stn_${stnId}`, CACHE_TTL, JSON.stringify(response.data.data))
      return response && response.data && response.data.data
    } else {
      return 'Error retrieving data from API.'
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

    if (response && response.data && response.data.status === 'ok') {
      client.setex(`stn-nr_${lat}-${lng}`, CACHE_TTL, JSON.stringify(response.data.data))
      return response && response.data && response.data.data
    } else {
      return 'Error retrieving data from API.'
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

    if (response && response.data && response.data.status === 'ok') {
      client.setex(`stn-bnd_${ul_lat}-${ul_lng}-${lr_lat}-${lr_lng}`, CACHE_TTL, JSON.stringify(response.data.data))
      return response && response.data && response.data.data
    } else {
      return 'Error retrieving data from API.'
    }
  } catch (error) {
    console.error(error)
    return error
  }
}
