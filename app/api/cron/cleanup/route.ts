// app/api/cron/cleanup/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Order from '@/models/Order'
import { Notification } from '@/models/Notification'
import { ChatConversation } from '@/models/Chat'
import { AuditLog, EmailLog, CronLog } from '@/models/System'
import { verifyCronSecret, successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    if (!verifyCronSecret(request)) return errorResponse('Unauthorized', 401, ErrorCodes.AUTHENTICATION_ERROR)

    await connectDB()

    const results = { processed: 0, succeeded: 0, failed: 0, details: {} as Record<string, number> }
    const now = new Date()

    // 1. Mark expired pending orders
    try {
      const expiredOrders = await Order.updateMany(
        { status: 'pending', expiresAt: { $lt: now } },
        { $set: { status: 'expired' } }
      )
      results.details.expiredOrders = expiredOrders.modifiedCount
      results.succeeded += expiredOrders.modifiedCount
      results.processed += expiredOrders.modifiedCount
    } catch (e) { results.failed++ }

    // 2. Mark no-show bookings
    try {
      const noShowDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const noShows = await Booking.updateMany(
        { status: 'confirmed', startDate: { $lt: noShowDate }, actualCheckIn: { $exists: false } },
        { $set: { status: 'no_show' } }
      )
      results.details.noShowBookings = noShows.modifiedCount
      results.succeeded += noShows.modifiedCount
      results.processed += noShows.modifiedCount
    } catch (e) { results.failed++ }

    // 3. Auto-close inactive conversations (7 days)
    try {
      const inactiveDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const closedConversations = await ChatConversation.updateMany(
        { status: { $in: ['active', 'pending'] }, lastMessageAt: { $lt: inactiveDate } },
        { $set: { status: 'closed', closedAt: now } }
      )
      results.details.closedConversations = closedConversations.modifiedCount
      results.succeeded += closedConversations.modifiedCount
      results.processed += closedConversations.modifiedCount
    } catch (e) { results.failed++ }

    // 4. Delete old read notifications (30 days)
    try {
      const oldNotificationDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const deletedNotifications = await Notification.deleteMany({ read: true, createdAt: { $lt: oldNotificationDate } })
      results.details.deletedNotifications = deletedNotifications.deletedCount
      results.succeeded += deletedNotifications.deletedCount
      results.processed += deletedNotifications.deletedCount
    } catch (e) { results.failed++ }

    // 5. Delete old audit logs (90 days)
    try {
      const oldAuditDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      const deletedAuditLogs = await AuditLog.deleteMany({ createdAt: { $lt: oldAuditDate } })
      results.details.deletedAuditLogs = deletedAuditLogs.deletedCount
      results.processed += deletedAuditLogs.deletedCount
    } catch (e) { results.failed++ }

    // 6. Delete old email logs (30 days)
    try {
      const oldEmailDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const deletedEmailLogs = await EmailLog.deleteMany({ createdAt: { $lt: oldEmailDate } })
      results.details.deletedEmailLogs = deletedEmailLogs.deletedCount
      results.processed += deletedEmailLogs.deletedCount
    } catch (e) { results.failed++ }

    // 7. Auto-complete in-progress bookings
    try {
      const completeDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const completed = await Booking.updateMany(
        { status: 'in_progress', endDate: { $lt: completeDate } },
        { $set: { status: 'completed', actualCheckOut: now } }
      )
      results.details.autoCompletedBookings = completed.modifiedCount
      results.succeeded += completed.modifiedCount
      results.processed += completed.modifiedCount
    } catch (e) { results.failed++ }

    const executionTime = Date.now() - startTime

    await CronLog.create({
      jobName: 'cleanup',
      status: results.failed === 0 ? 'completed' : 'partial',
      results,
      executionTime,
      startedAt: new Date(startTime),
      completedAt: new Date(),
    })

    return successResponse({ ...results, executionTime: `${executionTime}ms` }, 'Cleanup completed')
  } catch (error: any) {
    const executionTime = Date.now() - startTime

    await CronLog.create({
      jobName: 'cleanup',
      status: 'failed',
      executionTime,
      errorMessage: error.message,
      startedAt: new Date(startTime),
      completedAt: new Date(),
    }).catch(() => {})

    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
