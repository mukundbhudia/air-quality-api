const redis = require("redis")
const logger = require('./logger').initLogger()

let client
const PORT = process.env.REDIS_URL || 6379

const connectDB = async () => {
  try {
    client = redis.createClient(PORT)
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
