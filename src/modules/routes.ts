import { promisify } from 'util'
import { getClient } from './dbClient'
import { 
  homeRoot,
  keyWordSearch,
  getStationData,
  getMultipleStationData,
  getNearestStationData,
  getStationsInBoundsData,
} from './actions'

const client = getClient()
const getAsync = promisify(client.get).bind(client)

export const home = async (req, res) => {
  const timeStamp: string = await homeRoot()
  res.json({
    msg: `Welcome to the air quality API!`,
    startTime: timeStamp
  })
}

export const search = async (req, res) => {
  const keyword: string = req.query && req.query.q
  let data: any = null
  if (keyword) {
    const qk = await getAsync(`qk_${keyword}`)
    if (qk) {
      data = JSON.parse(qk)
    } else {
      data = await keyWordSearch(keyword)
    }
    res.json( { data } )
  } else {
    res.status(400).json({ 'msg': 'No keyword supplied' })
  }
}

export const getStation = async (req, res) => {
  const stnId: string = req.query && req.query.stnId
  let data: any = null
  if (stnId) {
    const stationData = await getAsync(`stn_${stnId}`)
    if (stationData) {
      data = JSON.parse(stationData)
    } else {
      data = await getStationData(stnId)
    }
    res.json( { data } )
  } else {
    res.status(400).json({ 'msg': 'No station supplied' })
  }
}

export const getMultipleStations = async (req, res) => {
  // const stnId: string = req.query && req.query.stnId
  let allStations: Array<string> = ['5115', '5724']
  let data: any = null
  if (allStations) {
    const stationData = await getAsync(`mult_stn_${allStations.join('-')}`)
    
    if (stationData) {
      data = JSON.parse(stationData)
    } else {
      data = await getMultipleStationData(allStations)
    }
    res.json( { data } )
  } else {
    res.status(400).json({ 'msg': 'No station array supplied' })
  }
}

export const getNearestStation = async (req, res) => {
  const lat: string = req.query && req.query.lat
  const lng: string = req.query && req.query.lng
  let data: any = null

  if (lat && lng) {
    const stationData = await getAsync(`stn-nr_${lat}-${lng}`)
    if (stationData) {
      data = JSON.parse(stationData)
    } else {
      try {
        data = await getNearestStationData(parseFloat(lat), parseFloat(lng))
      } catch (error) {
        console.error(error)
        res.status(400).json({ 'msg': 'Coordinates cannot be parsed' })
      }
    }
    res.json( { data } )
  } else {
    res.status(400).json({ 'msg': 'No coordinates supplied' })
  }
}

export const getStationsInBounds = async (req, res) => {
  const param_ul_lat: string = req.query && req.query.ul_lat
  const param_ul_lng: string = req.query && req.query.ul_lng
  const param_lr_lat: string = req.query && req.query.lr_lat
  const param_lr_lng: string = req.query && req.query.lr_lng
  let ul_lat: number, ul_lng: number, lr_lat: number, lr_lng: number
  let data: any = null

  try {
    ul_lat = parseFloat(param_ul_lat)
    ul_lng = parseFloat(param_ul_lng)
    lr_lat = parseFloat(param_lr_lat)
    lr_lng = parseFloat(param_lr_lng)
  } catch (error) {
    console.error(error)
    res.status(400).json({ 'msg': 'Coordinates cannot be parsed' })
  }

  if (ul_lat && ul_lng && lr_lat && lr_lng) {
    const stationData = await getAsync(`stn-bnd_${ul_lat}-${ul_lng}-${lr_lat}-${lr_lng}`)
    if (stationData) {
      data = JSON.parse(stationData)
    } else {
      data = await getStationsInBoundsData(
        ul_lat,
        ul_lng,
        lr_lat,
        lr_lng,
      )
    }
    res.json( { data } )
  } else {
    res.status(400).json({ 'msg': 'No coordinates supplied' })
  }
}