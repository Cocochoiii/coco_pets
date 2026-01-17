// app/api/notifications/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Notification } from '@/models/Notification'
import { verifyAuth } from '@/lib/auth'
import { successResponse, errorResponse, getPaginationParams, ErrorCodes } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const { page, limit, skip } = getPaginationParams(searchParams)

    await connectDB()

    const query: any = { user: auth.userId }
    if (unreadOnly) query.read = false

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(query),
      Notification.countDocuments({ user: auth.userId, read: false }),
    ])

    return successResponse({ notifications, unreadCount, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const body = await request.json()
    const { notificationId, markAllRead } = body

    await connectDB()

    if (markAllRead) {
      await Notification.updateMany({ user: auth.userId, read: false }, { $set: { read: true, readAt: new Date() } })
      return successResponse(null, 'All notifications marked as read')
    }

    if (!notificationId) return errorResponse('Notification ID required', 400)

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: auth.userId },
      { $set: { read: true, readAt: new Date() } },
      { new: true }
    )

    if (!notification) return errorResponse('Notification not found', 404, ErrorCodes.NOT_FOUND)

    return successResponse(notification, 'Notification marked as read')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const deleteAllRead = searchParams.get('all_read') === 'true'

    await connectDB()

    if (deleteAllRead) {
      const result = await Notification.deleteMany({ user: auth.userId, read: true })
      return successResponse({ deleted: result.deletedCount }, 'Read notifications deleted')
    }

    if (!notificationId) return errorResponse('Notification ID required', 400)

    await Notification.findOneAndDelete({ _id: notificationId, user: auth.userId })

    return successResponse(null, 'Notification deleted')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
