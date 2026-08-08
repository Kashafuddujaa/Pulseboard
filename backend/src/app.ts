import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler.js'
import { healthRouter } from './routes/health.js'
import { meRouter } from './routes/me.js'

export const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/api', healthRouter)
app.use('/api', meRouter)

app.use(errorHandler)
