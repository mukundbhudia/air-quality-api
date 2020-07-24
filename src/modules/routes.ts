import { promisify } from 'util'
import { getClient } from './dbClient'
import { homeRoot, keyWordSearch } from './actions'

const client = getClient()
const getAsync = promisify(client.get).bind(client)

export const home = async (req, res) => {
  const timeStamp: string = await homeRoot()
  res.json({ msg: `Welcome to the air quality API! Server start time is: ${timeStamp}` })
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
