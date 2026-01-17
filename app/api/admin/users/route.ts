// app/api/admin/users/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { verifyAdmin } from '@/lib/auth'
import { successResponse, errorResponse, getPaginationParams, ErrorCodes } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const { page, limit, skip } = getPaginationParams(searchParams)

    await connectDB()

    const query: any = {}
    if (role) query.role = role
    if (status) query.status = status
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -passwordResetToken -passwordResetExpires -tokenVersion')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ])

    return successResponse({
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const body = await request.json()
    const { userId, role, status, adminNotes } = body

    if (!userId) return errorResponse('User ID required', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const updates: any = {}
    if (role) updates.role = role
    if (status) updates.status = status
    if (adminNotes !== undefined) updates.adminNotes = adminNotes

    const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true })
      .select('-password -passwordResetToken -passwordResetExpires -tokenVersion')

    if (!user) return errorResponse('User not found', 404, ErrorCodes.NOT_FOUND)

    return successResponse(user, 'User updated successfully')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    const permanent = searchParams.get('permanent') === 'true'

    if (!userId) return errorResponse('User ID required', 400, ErrorCodes.VALIDATION_ERROR)
    if (userId === auth.userId) return errorResponse('Cannot delete your own account', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    if (permanent) {
      await User.findByIdAndDelete(userId)
      return successResponse(null, 'User permanently deleted')
    } else {
      await User.findByIdAndUpdate(userId, { status: 'banned' })
      return successResponse(null, 'User banned')
    }
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
