// app/api/admin/analytics/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Pet from '@/models/Pet'
import Booking from '@/models/Booking'
import Order from '@/models/Order'
import { Review } from '@/models/System'
import { verifyAdmin } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'
import { formatAmount } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    await connectDB()

    const now = new Date()
    let startDate: Date
    switch (period) {
      case '7d': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break
      case '90d': startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break
      case '1y': startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break
      default: startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const [userStats, petStats, bookingStats, revenueStats, reviewStats, petTypeDistribution, bookingTrend, recentOrders] = await Promise.all([
      User.countDocuments(),
      Pet.countDocuments({ isActive: true }),
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }, cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }, pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }, confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } } } }
      ]),
      Order.aggregate([
        { $match: { status: 'paid', createdAt: { $gte: startDate } } },
        { $group: { _id: null, totalRevenue: { $sum: '$amounts.paid' }, totalOrders: { $sum: 1 }, avgOrderValue: { $avg: '$amounts.paid' } } }
      ]),
      Review.aggregate([{ $match: { status: 'approved' } }, { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }]),
      Booking.aggregate([{ $match: { createdAt: { $gte: startDate } } }, { $group: { _id: '$petDetails.type', count: { $sum: 1 } } }]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, bookings: { $sum: 1 }, revenue: { $sum: '$pricing.total' } } },
        { $sort: { _id: 1 } }, { $limit: 30 }
      ]),
      Order.find({ status: 'paid' }).sort({ createdAt: -1 }).limit(5).populate('user', 'name email').populate('booking', 'bookingNumber'),
    ])

    const stats = bookingStats[0] || { total: 0, completed: 0, cancelled: 0, pending: 0, confirmed: 0 }
    const revenue = revenueStats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }
    const reviews = reviewStats[0] || { avgRating: 0, totalReviews: 0 }

    return successResponse({
      overview: { totalUsers: userStats, totalPets: petStats, totalBookings: stats.total, revenue: revenue.totalRevenue, revenueFormatted: formatAmount(revenue.totalRevenue), avgOrderValue: revenue.avgOrderValue, avgOrderValueFormatted: formatAmount(revenue.avgOrderValue), avgRating: reviews.avgRating?.toFixed(1) || '0.0' },
      bookings: { ...stats, completionRate: stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0, cancellationRate: stats.total > 0 ? ((stats.cancelled / stats.total) * 100).toFixed(1) : 0 },
      petTypeDistribution: petTypeDistribution.reduce((acc: any, curr) => { acc[curr._id] = curr.count; return acc }, {}),
      bookingTrend: bookingTrend.map((item) => ({ date: item._id, bookings: item.bookings, revenue: item.revenue, revenueFormatted: formatAmount(item.revenue) })),
      recentOrders: recentOrders.map((order: any) => ({ orderId: order.orderId, customer: order.user?.name || order.customer?.name, amount: order.amounts.paid, amountFormatted: formatAmount(order.amounts.paid), bookingNumber: order.booking?.bookingNumber, date: order.createdAt })),
      period,
    })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
