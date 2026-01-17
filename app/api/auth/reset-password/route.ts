// app/api/auth/reset-password/route.ts
import { NextRequest } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, validatePassword } from '@/lib/auth'
import { successResponse, errorResponse, validateRequired, ErrorCodes } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    const validationError = validateRequired(body, ['token', 'password'])
    if (validationError) return errorResponse(validationError, 400, ErrorCodes.VALIDATION_ERROR)

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return errorResponse(passwordValidation.errors.join(', '), 400, ErrorCodes.VALIDATION_ERROR)
    }

    await connectDB()

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: new Date() },
    })

    if (!user) {
      return errorResponse('Invalid or expired reset token', 400, ErrorCodes.VALIDATION_ERROR)
    }

    user.password = await hashPassword(password)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.tokenVersion = (user.tokenVersion || 0) + 1 // Invalidate all existing tokens
    user.loginAttempts = 0
    user.lockUntil = undefined
    await user.save()

    return successResponse(null, 'Password reset successful. Please login with your new password.')
  } catch (error: any) {
    console.error('Reset password error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
