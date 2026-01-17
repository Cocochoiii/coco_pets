// app/api/auth/me/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { verifyAuth, hashPassword, validatePassword } from '@/lib/auth'
import { successResponse, errorResponse, sanitizeInput, ErrorCodes } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    await connectDB()

    const user = await User.findById(auth.userId).select('-password -passwordResetToken -passwordResetExpires -tokenVersion')
    if (!user) return errorResponse('User not found', 404, ErrorCodes.NOT_FOUND)

    return successResponse({ user })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const body = await request.json()
    const { name, phone, avatar, preferences, currentPassword, newPassword } = body

    await connectDB()

    const updates: any = {}
    if (name) updates.name = sanitizeInput(name)
    if (phone !== undefined) updates.phone = phone ? sanitizeInput(phone) : null
    if (avatar !== undefined) updates.avatar = avatar
    if (preferences) updates.preferences = preferences

    // Password change
    if (newPassword) {
      if (!currentPassword) return errorResponse('Current password required', 400, ErrorCodes.VALIDATION_ERROR)

      const user = await User.findById(auth.userId).select('+password')
      if (!user) return errorResponse('User not found', 404, ErrorCodes.NOT_FOUND)

      const { comparePassword } = await import('@/lib/auth')
      const isValid = await comparePassword(currentPassword, user.password)
      if (!isValid) return errorResponse('Current password is incorrect', 400, ErrorCodes.VALIDATION_ERROR)

      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.valid) return errorResponse(passwordValidation.errors.join(', '), 400, ErrorCodes.VALIDATION_ERROR)

      updates.password = await hashPassword(newPassword)
      updates.tokenVersion = (user.tokenVersion || 0) + 1
    }

    const user = await User.findByIdAndUpdate(auth.userId, { $set: updates }, { new: true })
      .select('-password -passwordResetToken -passwordResetExpires -tokenVersion')

    return successResponse({ user }, 'Profile updated successfully')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
