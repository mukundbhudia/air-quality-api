import { promisify } from 'util'
import { getClient } from './dbClient'
import { homeRoot, keyWordSearch, getStationData } from './actions'

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
