import { Router } from 'express'
import type { Prisma, Report, ReportType } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { requireMembership } from '../middleware/requireManager.js'
import { computeReportMetrics } from '../lib/reportMetrics.js'

export const reportsRouter = Router()

const REPORT_TYPES = new Set<ReportType>([
  'sales',
  'traffic',
  'team_activity',
  'custom',
])
const RANGES = new Set(['7', '30', '90'])
const RANGE_LABELS: Record<string, string> = {
  '7': 'Last 7 days',
  '30': 'Last 30 days',
  '90': 'Last 90 days',
}
const TYPE_LABELS: Record<ReportType, string> = {
  sales: 'Sales',
  traffic: 'Traffic',
  team_activity: 'Team Activity',
  custom: 'Custom',
}

function serializeReport(report: Report & { createdBy: { name: string } }) {
  return {
    id: report.id,
    name: report.name,
    type: report.type,
    status: report.status,
    createdAt: report.createdAt,
    createdBy: report.createdBy.name,
    metrics: report.metrics,
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

reportsRouter.get(
  '/reports',
  requireAuth,
  requireMembership(),
  async (req, res, next) => {
    try {
      const reports = await prisma.report.findMany({
        where: { workspaceId: req.membership!.workspaceId },
        include: { createdBy: true },
        orderBy: { createdAt: 'desc' },
      })
      res.json(reports.map(serializeReport))
    } catch (err) {
      next(err)
    }
  },
)

reportsRouter.post(
  '/reports',
  requireAuth,
  requireMembership(),
  async (req, res, next) => {
    try {
      const { type, range } = req.body as { type?: ReportType; range?: string }
      if (!type || !REPORT_TYPES.has(type) || !range || !RANGES.has(range)) {
        res.status(400).json({ error: 'A valid type and range are required' })
        return
      }

      const report = await prisma.report.create({
        data: {
          workspaceId: req.membership!.workspaceId,
          name: `${TYPE_LABELS[type]} Report — ${RANGE_LABELS[range]}`,
          type,
          status: 'generating',
          createdById: req.user!.id,
          metrics: [],
        },
        include: { createdBy: true },
      })

      await delay(800)

      const metrics = await computeReportMetrics(
        type,
        range as '7' | '30' | '90',
        req.membership!.workspaceId,
      )

      const ready = await prisma.report.update({
        where: { id: report.id },
        data: { status: 'ready', metrics: metrics as unknown as Prisma.InputJsonValue },
        include: { createdBy: true },
      })

      res.status(201).json(serializeReport(ready))
    } catch (err) {
      next(err)
    }
  },
)

reportsRouter.delete(
  '/reports/:id',
  requireAuth,
  requireMembership(),
  async (req, res, next) => {
    try {
      const target = await prisma.report.findFirst({
        where: {
          id: String(req.params.id),
          workspaceId: req.membership!.workspaceId,
        },
      })
      if (!target) {
        res.status(404).json({ error: 'Report not found' })
        return
      }

      await prisma.report.delete({ where: { id: target.id } })
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
)
