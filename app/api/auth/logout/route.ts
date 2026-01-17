// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { successResponse } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  const response = successResponse(null, 'Logged out successfully')
  
  response.cookies.set('token', '', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0, path: '/' })
  response.cookies.set('refreshToken', '', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0, path: '/' })
  
  return response
}
