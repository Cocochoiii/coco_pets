// app/api/notifications/subscribe/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { PushSubscription } from '@/models/Notification'
import { verifyAuth } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'
import config from '@/config'

export async function GET() {
  return successResponse({ vapidPublicKey: config.notifications.vapidPublicKey })
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const body = await request.json()
    const { subscription, deviceInfo } = body

    if (!subscription?.endpoint || !subscription?.keys) return errorResponse('Invalid subscription', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const pushSub = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { $set: { user: auth.userId, endpoint: subscription.endpoint, keys: { p256dh: subscription.keys.p256dh, auth: subscription.keys.auth }, deviceInfo: deviceInfo || {}, isActive: true, lastUsedAt: new Date() } },
      { new: true, upsert: true }
    )

    return successResponse({ subscriptionId: pushSub._id }, 'Subscription saved')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const body = await request.json()
    const { endpoint } = body

    if (!endpoint) return errorResponse('Endpoint required', 400)

    await connectDB()

    await PushSubscription.findOneAndUpdate({ endpoint, user: auth.userId }, { $set: { isActive: false } })

    return successResponse(null, 'Subscription removed')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
