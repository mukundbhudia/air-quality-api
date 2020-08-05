import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { initLogger } from './modules/logger'
import * as routes from './modules/routes'

require('dotenv').config()
initLogger()

const app = express()
const PORT: number = parseInt(process.env.PORT) || 4000
const API_TOKEN: string = process.env.API_TOKEN

const bodyParserOptions = {
  inflate: true,
}

const startServer = async () => {
  app.use(cors())
    .use(bodyParser.json(bodyParserOptions))
    .get('/', routes.home)
    .get('/search', routes.search)
    .get('/getStation', routes.getStation)
    .get('/getMultipleStations', routes.getMultipleStations)
    .get('/getNearestStation', routes.getNearestStation)
    .get('/getStationsInBounds', routes.getStationsInBounds)

  app.listen(PORT, () => {
    const welcomeMessage: string = `Listening at http://localhost:${PORT}`
    console.info(welcomeMessage)
    // logger.info(welcomeMessage)
  })
}
  
if (API_TOKEN) {
  startServer()
} else {
  console.error(`No API token supplied. Quitting server.`)
  process.exit()
}
