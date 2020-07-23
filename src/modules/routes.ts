import { connectDB, getClient } from './dbClient'
import axios from 'axios'

const { promisify } = require("util")
connectDB()
const client = getClient()
const getAsync = promisify(client.get).bind(client)
client.set('server-timestamp', new Date())

export const home = async (req, res) => {
  const timeStamp = await getAsync('server-timestamp')
  res.json({ msg: `Welcome to the air quality API! Server start time is: ${timeStamp}` })
}

export const search = async (req, res) => {
  const keyword: string = req.query && req.query.keyword
  if (keyword) {
    axios.get('https://api.waqi.info/search/', {
      params: {
        token: process.env.API_TOKEN,
        keyword: keyword
      }
    })
    .then((response) => {
      res.json( {'data': response.data.data as Array<any>} )
    })
    .catch((error) => {
      console.error(error)
      res.status(400).json( {'msg': error} )
    })
  } else {
    res.status(400).json({ 'msg': 'No keyword supplied' })
  }
}
