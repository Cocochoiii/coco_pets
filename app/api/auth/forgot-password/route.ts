// app/api/auth/forgot-password/route.ts
import { NextRequest } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { successResponse, errorResponse, validateEmail, ErrorCodes } from '@/lib/api-utils'
import { sendEmail } from '@/lib/services/email'
import config from '@/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !validateEmail(email)) {
      return errorResponse('Valid email required', 400, ErrorCodes.VALIDATION_ERROR)
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase() })

    // Always return success to prevent email enumeration
    if (!user) {
      return successResponse(null, 'If an account exists with this email, a password reset link has been sent.')
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    user.passwordResetToken = resetTokenHash
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await user.save()

    const resetUrl = `${config.app.url}/reset-password?token=${resetToken}`

    await sendEmail({
      to: user.email,
      template: 'password-reset',
      data: {
        name: user.name,
        resetUrl,
        expiresIn: '1 hour',
      },
    })

    return successResponse(null, 'If an account exists with this email, a password reset link has been sent.')
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
