// app/api/health/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'
import config from '@/config'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const services: Record<string, { status: string; latency?: number; error?: string }> = {}

  // Check database
  try {
    const dbStart = Date.now()
    await connectDB()
    services.database = { status: 'healthy', latency: Date.now() - dbStart }
  } catch (error: any) {
    services.database = { status: 'unhealthy', error: error.message }
  }

  // Check Stripe
  try {
    services.stripe = { status: config.stripe.secretKey ? 'configured' : 'not_configured' }
  } catch (error: any) {
    services.stripe = { status: 'error', error: error.message }
  }

  // Check push notifications
  try {
    services.pushNotifications = { status: config.notifications.vapidPublicKey ? 'configured' : 'not_configured' }
  } catch (error: any) {
    services.pushNotifications = { status: 'error', error: error.message }
  }

  const allHealthy = Object.values(services).every(s => s.status === 'healthy' || s.status === 'configured')
  const totalLatency = Date.now() - startTime

  if (allHealthy) {
    return successResponse({
      status: 'healthy',
      version: '2.0.0',
      environment: config.app.env,
      timestamp: new Date().toISOString(),
      services,
      responseTime: `${totalLatency}ms`,
    })
  } else {
    return errorResponse('Some services are unhealthy', 503, ErrorCodes.INTERNAL_ERROR)
  }
}
