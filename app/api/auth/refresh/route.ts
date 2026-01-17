// app/api/auth/refresh/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken, generateToken, generateRefreshToken } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'
import config from '@/config'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) return errorResponse('Refresh token required', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const payload = verifyToken(refreshToken)
    if (!payload) return errorResponse('Invalid refresh token', 401, ErrorCodes.AUTHENTICATION_ERROR)

    await connectDB()

    const user = await User.findById(payload.userId)
    if (!user) return errorResponse('User not found', 404, ErrorCodes.NOT_FOUND)
    if (user.status !== 'active') return errorResponse('Account is not active', 403, ErrorCodes.AUTHORIZATION_ERROR)
    if (user.tokenVersion !== payload.tokenVersion) return errorResponse('Token has been revoked', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role, tokenVersion: user.tokenVersion }
    const newToken = generateToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

    const response = successResponse({ token: newToken, refreshToken: newRefreshToken }, 'Token refreshed')

    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: config.app.isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: config.app.isProd,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
