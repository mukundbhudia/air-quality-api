import { connectDB, getClient } from './dbClient'
const { promisify } = require("util")
connectDB()
const client = getClient()
const getAsync = promisify(client.get).bind(client)
client.set('server-timestamp', new Date())

export const home = async (req, res) => {
  const timeStamp = await getAsync('server-timestamp')
  res.json({ msg: `Welcome to the air quality API! Server start time is: ${timeStamp}` })
}
