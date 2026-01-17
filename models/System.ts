// models/System.ts
import mongoose, { Schema, Document } from 'mongoose'

// Review Model
export interface IReview extends Document {
  booking: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  pet?: mongoose.Types.ObjectId
  rating: number
  title?: string
  content?: string
  images: string[]
  response?: { content: string; respondedBy: mongoose.Types.ObjectId; respondedAt: Date }
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  isFeatured: boolean
  isVerified: boolean
  helpfulCount: number
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  pet: { type: Schema.Types.ObjectId, ref: 'Pet' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  content: { type: String },
  images: [{ type: String }],
  response: {
    content: { type: String },
    respondedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    respondedAt: { type: Date },
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'flagged'], default: 'pending' },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
}, { timestamps: true })

ReviewSchema.index({ booking: 1 })
ReviewSchema.index({ user: 1 })
ReviewSchema.index({ status: 1, isFeatured: -1 })

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)

// Audit Log
export interface IAuditLog extends Document {
  user?: mongoose.Types.ObjectId
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, any>
  ip?: string
  userAgent?: string
  createdAt: Date
}

const AuditLogSchema = new Schema<IAuditLog>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: { type: String },
  details: { type: Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
}, { timestamps: true })

AuditLogSchema.index({ user: 1 })
AuditLogSchema.index({ createdAt: -1 })
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema)

// Email Log
export interface IEmailLog extends Document {
  to: string
  template: string
  subject: string
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
  messageId?: string
  error?: string
  sentAt?: Date
  deliveredAt?: Date
  createdAt: Date
}

const EmailLogSchema = new Schema<IEmailLog>({
  to: { type: String, required: true },
  template: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'], default: 'pending' },
  messageId: { type: String },
  error: { type: String },
  sentAt: { type: Date },
  deliveredAt: { type: Date },
}, { timestamps: true })

EmailLogSchema.index({ to: 1 })
EmailLogSchema.index({ createdAt: -1 })
EmailLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 })

export const EmailLog = mongoose.models.EmailLog || mongoose.model<IEmailLog>('EmailLog', EmailLogSchema)

// Cron Log
export interface ICronLog extends Document {
  jobName: string
  status: 'started' | 'completed' | 'failed' | 'partial'
  results?: Record<string, any>
  executionTime?: number
  errorMessage?: string
  startedAt: Date
  completedAt?: Date
  createdAt: Date
}

const CronLogSchema = new Schema<ICronLog>({
  jobName: { type: String, required: true },
  status: { type: String, enum: ['started', 'completed', 'failed', 'partial'], required: true },
  results: { type: Schema.Types.Mixed },
  executionTime: { type: Number },
  errorMessage: { type: String },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date },
}, { timestamps: true })

CronLogSchema.index({ jobName: 1, createdAt: -1 })
CronLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 })

export const CronLog = mongoose.models.CronLog || mongoose.model<ICronLog>('CronLog', CronLogSchema)

// System Settings
export interface ISystemSettings extends Document {
  key: string
  value: any
  description?: string
  isPublic: boolean
  updatedBy?: mongoose.Types.ObjectId
  updatedAt: Date
}

const SystemSettingsSchema = new Schema<ISystemSettings>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  description: { type: String },
  isPublic: { type: Boolean, default: false },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export const SystemSettings = mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema)
