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
  app.use(bodyParser.json(bodyParserOptions))
  app.get('/', routes.home)
  app.get('/search', routes.search)

  app.listen(PORT, () => {
    const welcomeString = `Listening at http://localhost:${PORT}`
    console.log(welcomeString)
    // logger.info(welcomeString)
  })
}
  
if (API_TOKEN) {
  startServer()
} else {
  console.error(`No API token supplied. Quitting server.`)
  process.exit()
}
