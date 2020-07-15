const redis = require("redis")
const logger = require('./logger').initLogger()

let client

const connectDB = async () => {
  try {
    client = redis.createClient()
  } catch (error) {
    console.error(error)
    logger.error(error)
  }
}

const getClient = () => client

module.exports = {
  connectDB,
  getClient,
}
