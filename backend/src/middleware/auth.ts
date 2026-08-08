import type { NextFunction, Request, Response } from 'express'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { env } from '../config/env.js'

export interface AuthenticatedUser {
  id: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

// Supabase's newer projects sign JWTs asymmetrically (ES256) and publish the
// verification key via JWKS, rather than the older shared HS256 secret.
// createRemoteJWKSet caches the key set and handles rotation automatically.
const jwks = createRemoteJWKSet(
  new URL('/auth/v1/.well-known/jwks.json', env.supabaseUrl),
)

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    res.status(401).json({ error: 'Missing bearer token' })
    return
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${env.supabaseUrl}/auth/v1`,
    })
    req.user = { id: payload.sub as string, email: payload.email as string }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
