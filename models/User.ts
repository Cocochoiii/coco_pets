// models/User.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin' | 'staff'
  status: 'active' | 'suspended' | 'banned' | 'pending'
  emailVerified: boolean
  emailVerificationToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  tokenVersion: number
  stripeCustomerId?: string
  preferences: {
    notifications: { email: boolean; push: boolean; sms: boolean }
    marketing: boolean
    language: string
    timezone: string
  }
  referralCode?: string
  referredBy?: mongoose.Types.ObjectId
  totalBookings: number
  totalSpent: number
  loginAttempts: number
  lockUntil?: Date
  lastLoginAt?: Date
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  avatar: { type: String },
  role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
  status: { type: String, enum: ['active', 'suspended', 'banned', 'pending'], default: 'active' },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  tokenVersion: { type: Number, default: 0 },
  stripeCustomerId: { type: String },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    marketing: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'America/New_York' },
  },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
  totalBookings: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  lastLoginAt: { type: Date },
  adminNotes: { type: String },
}, { timestamps: true })

UserSchema.index({ email: 1 })
UserSchema.index({ referralCode: 1 })
UserSchema.index({ role: 1, status: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
