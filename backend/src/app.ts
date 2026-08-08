import { createRequire } from 'node:module'
import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { healthRouter } from './routes/health.js'
import { meRouter } from './routes/me.js'
import { teamRouter } from './routes/team.js'
import { reportsRouter } from './routes/reports.js'
import { metricsRouter } from './routes/metrics.js'

// Resolved via Node's own require() rather than a static import, to sidestep
// environment-sensitive differences in how helmet's CJS/ESM default export
// gets typed (worked locally, failed under Vercel's build with a "not
// callable" error on the same locked dependency version).
const require = createRequire(import.meta.url)
const helmet = require('helmet') as typeof import('helmet').default

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.frontendUrl }))
app.use(express.json())

app.use('/api', healthRouter)
app.use('/api', meRouter)
app.use('/api', teamRouter)
app.use('/api', reportsRouter)
app.use('/api', metricsRouter)

app.use(errorHandler)
