// models/Notification.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  type: 'booking' | 'payment' | 'reminder' | 'promotion' | 'system' | 'chat'
  title: string
  message: string
  data?: Record<string, any>
  channels: ('in_app' | 'email' | 'push' | 'sms')[]
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  read: boolean
  readAt?: Date
  actionUrl?: string
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['booking', 'payment', 'reminder', 'promotion', 'system', 'chat'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  channels: [{ type: String, enum: ['in_app', 'email', 'push', 'sms'] }],
  status: { type: String, enum: ['pending', 'sent', 'delivered', 'failed'], default: 'pending' },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  actionUrl: { type: String },
}, { timestamps: true })

NotificationSchema.index({ user: 1, read: 1 })
NotificationSchema.index({ createdAt: -1 })

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)

// Push Subscription
export interface IPushSubscription extends Document {
  user: mongoose.Types.ObjectId
  endpoint: string
  keys: { p256dh: string; auth: string }
  deviceInfo?: { browser?: string; os?: string; device?: string }
  isActive: boolean
  lastUsedAt?: Date
  createdAt: Date
}

const PushSubscriptionSchema = new Schema<IPushSubscription>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  deviceInfo: {
    browser: { type: String },
    os: { type: String },
    device: { type: String },
  },
  isActive: { type: Boolean, default: true },
  lastUsedAt: { type: Date },
}, { timestamps: true })

export const PushSubscription = mongoose.models.PushSubscription || mongoose.model<IPushSubscription>('PushSubscription', PushSubscriptionSchema)

// Availability
export interface IAvailability extends Document {
  date: Date
  petType: 'cat' | 'dog'
  capacity: { total: number; booked: number; blocked: number }
  pricing?: { override?: number; multiplier?: number }
  notes?: string
  isBlocked: boolean
  blockReason?: string
}

const AvailabilitySchema = new Schema<IAvailability>({
  date: { type: Date, required: true },
  petType: { type: String, enum: ['cat', 'dog'], required: true },
  capacity: {
    total: { type: Number, required: true },
    booked: { type: Number, default: 0 },
    blocked: { type: Number, default: 0 },
  },
  pricing: {
    override: { type: Number },
    multiplier: { type: Number },
  },
  notes: { type: String },
  isBlocked: { type: Boolean, default: false },
  blockReason: { type: String },
}, { timestamps: true })

AvailabilitySchema.index({ date: 1, petType: 1 }, { unique: true })

export const Availability = mongoose.models.Availability || mongoose.model<IAvailability>('Availability', AvailabilitySchema)

export default Notification
