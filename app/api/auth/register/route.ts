// app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, generateToken, generateRefreshToken, validatePassword } from '@/lib/auth'
import { successResponse, errorResponse, validateRequired, validateEmail, generateReferralCode, ErrorCodes } from '@/lib/api-utils'
import { sendWelcomeEmail } from '@/lib/services/email'
import config from '@/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, referralCode } = body

    const validationError = validateRequired(body, ['email', 'password', 'name'])
    if (validationError) return errorResponse(validationError, 400, ErrorCodes.VALIDATION_ERROR)

    if (!validateEmail(email)) return errorResponse('Invalid email format', 400, ErrorCodes.VALIDATION_ERROR)

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) return errorResponse(passwordValidation.errors.join(', '), 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) return errorResponse('Email already registered', 409, ErrorCodes.DUPLICATE_ERROR)

    // Handle referral
    let referredBy
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() })
      if (referrer) referredBy = referrer._id
    }

    const hashedPassword = await hashPassword(password)
    const userReferralCode = generateReferralCode()

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      phone: phone?.trim(),
      referralCode: userReferralCode,
      referredBy,
      role: email.toLowerCase() === config.admin.email ? 'admin' : 'customer',
    })

    const tokenPayload = { userId: user._id.toString(), email: user.email, role: user.role, tokenVersion: user.tokenVersion }
    const token = generateToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name, userReferralCode)

    const response = successResponse({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        referralCode: user.referralCode,
      },
      token,
      refreshToken,
    }, 'Registration successful')

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
    console.error('Registration error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}