import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { healthRouter } from './routes/health.js'
import { meRouter } from './routes/me.js'
import { teamRouter } from './routes/team.js'
import { reportsRouter } from './routes/reports.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.frontendUrl }))
app.use(express.json())

app.use('/api', healthRouter)
app.use('/api', meRouter)
app.use('/api', teamRouter)
app.use('/api', reportsRouter)

app.use(errorHandler)
