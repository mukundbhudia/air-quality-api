const dbClient = require('./dbClient')
const { promisify } = require("util")
dbClient.connectDB()
const client = dbClient.getClient()
const getAsync = promisify(client.get).bind(client)
client.set('server-timestamp', new Date())

const home = async (req, res) => {
  const timeStamp = await getAsync('server-timestamp')
  res.json({ msg: `Welcome to the air quality API! Server start time is: ${timeStamp}` })
}

module.exports = {
  home,
}
