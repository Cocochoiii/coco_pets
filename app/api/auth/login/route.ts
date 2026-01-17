// app/api/auth/login/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { comparePassword, generateToken, generateRefreshToken } from '@/lib/auth'
import { successResponse, errorResponse, validateRequired, validateEmail, ErrorCodes } from '@/lib/api-utils'
import config from '@/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const validationError = validateRequired(body, ['email', 'password'])
    if (validationError) return errorResponse(validationError, 400, ErrorCodes.VALIDATION_ERROR)

    if (!validateEmail(email)) return errorResponse('Invalid email format', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) return errorResponse('Invalid credentials', 401, ErrorCodes.AUTHENTICATION_ERROR)

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000)
      return errorResponse(`Account locked. Try again in ${minutes} minutes`, 423, ErrorCodes.AUTHENTICATION_ERROR)
    }

    // Check account status
    if (user.status === 'banned') return errorResponse('Account has been banned', 403, ErrorCodes.AUTHORIZATION_ERROR)
    if (user.status === 'suspended') return errorResponse('Account is suspended', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1
      if (user.loginAttempts >= config.auth.maxLoginAttempts) {
        user.lockUntil = new Date(Date.now() + config.auth.lockoutDuration)
      }
      await user.save()
      return errorResponse('Invalid credentials', 401, ErrorCodes.AUTHENTICATION_ERROR)
    }

    // Reset login attempts on success
    user.loginAttempts = 0
    user.lockUntil = undefined
    user.lastLoginAt = new Date()
    await user.save()

    const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role, tokenVersion: user.tokenVersion }
    const token = generateToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    const response = successResponse({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        preferences: user.preferences,
        referralCode: user.referralCode,
      },
      token,
      refreshToken,
    }, 'Login successful')

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: config.app.isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.app.isProd,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
