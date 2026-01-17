// lib/services/email.ts
import config from '@/config'

export interface EmailOptions {
  to: string
  toName?: string
  subject?: string
  template: string
  data?: Record<string, any>
}

const templates: Record<string, { subject: string; html: (data: any) => string }> = {
  welcome: {
    subject: "Welcome to Coco's Pet Paradise! 🐾",
    html: (data) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #EEE1DB 0%, #D4A5A5 100%); padding: 30px; border-radius: 16px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Welcome, ${data.name}! 🐾</h1>
        </div>
        <div style="padding: 30px 0;">
          <p style="color: #666; line-height: 1.6;">Thank you for joining Coco's Pet Paradise! We're excited to care for your furry friends.</p>
          <p style="color: #666; line-height: 1.6;">Your referral code: <strong style="color: #D4A5A5;">${data.referralCode}</strong></p>
          <p style="color: #666; line-height: 1.6;">Share this code with friends and both of you will receive 10% off!</p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">Coco's Pet Paradise | Wellesley Hills, MA</p>
        </div>
      </div>
    `,
  },
  'booking-confirmation': {
    subject: "Booking Confirmed! 🎉",
    html: (data) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #EEE1DB 0%, #D4A5A5 100%); padding: 30px; border-radius: 16px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Booking Confirmed! 🎉</h1>
        </div>
        <div style="padding: 30px 0;">
          <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <p style="color: #666; margin: 5px 0;"><strong>Booking #:</strong> ${data.bookingNumber}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Pet:</strong> ${data.petName}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Check-in:</strong> ${data.startDate}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Check-out:</strong> ${data.endDate}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Total:</strong> ${data.total}</p>
          </div>
          <p style="color: #666; line-height: 1.6;">Please bring vaccination records and any special food or medications.</p>
        </div>
      </div>
    `,
  },
  'payment-confirmation': {
    subject: "Payment Received ✅",
    html: (data) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #EEE1DB 0%, #D4A5A5 100%); padding: 30px; border-radius: 16px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Payment Received ✅</h1>
        </div>
        <div style="padding: 30px 0;">
          <p style="color: #666;">Order #: ${data.orderId}</p>
          <p style="color: #666;">Amount: ${data.amount}</p>
          <p style="color: #666; line-height: 1.6;">Thank you for your payment!</p>
        </div>
      </div>
    `,
  },
  'reminder': {
    subject: "Booking Reminder 📅",
    html: (data) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #EEE1DB 0%, #D4A5A5 100%); padding: 30px; border-radius: 16px; text-align: center;">
          <h1 style="color: #333; margin: 0;">${data.title} 📅</h1>
        </div>
        <div style="padding: 30px 0;">
          <p style="color: #666; line-height: 1.6;">${data.message}</p>
        </div>
      </div>
    `,
  },
  'review-request': {
    subject: "How was your stay? 🌟",
    html: (data) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #EEE1DB 0%, #D4A5A5 100%); padding: 30px; border-radius: 16px; text-align: center;">
          <h1 style="color: #333; margin: 0;">We hope ${data.petName} had a great time! 🌟</h1>
        </div>
        <div style="padding: 30px 0; text-align: center;">
          <p style="color: #666; line-height: 1.6;">Would you mind leaving us a review?</p>
          <a href="${config.app.url}/reviews/new?booking=${data.bookingId}" style="display: inline-block; padding: 12px 24px; background: #D4A5A5; color: white; text-decoration: none; border-radius: 8px; margin-top: 15px;">Leave a Review</a>
        </div>
      </div>
    `,
  },
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const template = templates[options.template]
    if (!template) {
      return { success: false, error: 'Template not found' }
    }

    if (config.app.isDev) {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject || template.subject,
        template: options.template,
      })
      return { success: true, messageId: `dev_${Date.now()}` }
    }

    // Production: integrate with SendGrid/Mailgun/AWS SES
    return { success: true, messageId: `prod_${Date.now()}` }
  } catch (error: any) {
    console.error('Email error:', error)
    return { success: false, error: error.message }
  }
}

export const sendWelcomeEmail = (to: string, name: string, referralCode: string) =>
  sendEmail({ to, template: 'welcome', data: { name, referralCode } })

export const sendBookingConfirmation = (to: string, data: any) =>
  sendEmail({ to, template: 'booking-confirmation', data })

export const sendPaymentConfirmation = (to: string, data: any) =>
  sendEmail({ to, template: 'payment-confirmation', data })

export const sendReviewRequest = (to: string, data: any) =>
  sendEmail({ to, template: 'review-request', data })

export default sendEmail
