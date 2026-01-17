// lib/auth.ts
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import config from '@/config'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  tokenVersion?: number
  iat?: number
  exp?: number
}

export interface AuthResult {
  userId: string
  user: { email: string; role: string; name?: string }
  token: string
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.auth.bcryptRounds)
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiresIn,
  })
}

export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, config.auth.jwtSecret, {
    expiresIn: config.auth.refreshTokenExpiresIn,
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, config.auth.jwtSecret) as JWTPayload
  } catch {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return request.cookies.get('token')?.value || null
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult | null> {
  const token = getTokenFromRequest(request)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  return {
    userId: payload.userId,
    user: { email: payload.email, role: payload.role },
    token,
  }
}

export async function verifyAdmin(request: NextRequest): Promise<AuthResult | null> {
  const auth = await verifyAuth(request)
  if (!auth || auth.user.role !== 'admin') return null
  return auth
}

export async function verifyStaff(request: NextRequest): Promise<AuthResult | null> {
  const auth = await verifyAuth(request)
  if (!auth || (auth.user.role !== 'admin' && auth.user.role !== 'staff')) return null
  return auth
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (password.length < 8) errors.push('Password must be at least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('Password must contain a number')
  return { valid: errors.length === 0, errors }
}
