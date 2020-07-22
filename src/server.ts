import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { initLogger } from './modules/logger'
import * as routes from './modules/routes'

require('dotenv').config()
initLogger()

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
    // logger.info(welcomeString)
  })
}
  
startServer()
