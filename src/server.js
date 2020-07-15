const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('../src/modules/logger').initLogger()

const routes = require('../src/modules/routes')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4000

const bodyParserOptions = {
  inflate: true,
}

const startServer = async () => {
  app.use(cors())
  app.use(bodyParser.json(bodyParserOptions))
  app.get('/', routes.home)

  app.listen(PORT, () => {
    const welcomeString = `Listening at http://localhost:${PORT}`
    console.log(welcomeString)
    logger.info(welcomeString)
  })
}
  
startServer()
