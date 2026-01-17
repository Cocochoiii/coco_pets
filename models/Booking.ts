// models/Booking.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IBooking extends Document {
  bookingNumber: string
  user?: mongoose.Types.ObjectId
  pet?: mongoose.Types.ObjectId
  petDetails: {
    name: string
    type: 'cat' | 'dog'
    breed?: string
    size?: 'small' | 'medium' | 'large'
    specialNeeds?: string
    medications?: string
    dietaryRequirements?: string
  }
  startDate: Date
  endDate: Date
  actualCheckIn?: Date
  actualCheckOut?: Date
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  paymentStatus: 'pending' | 'deposit_paid' | 'paid' | 'refunded' | 'failed'
  pricing: {
    dailyRate: number
    days: number
    subtotal: number
    addOnsTotal: number
    discount: number
    discountReason?: string
    tax: number
    total: number
  }
  paidAmount: number
  refundedAmount: number
  addOns: string[]
  specialRequests?: string
  customer: {
    name: string
    email: string
    phone?: string
    address?: string
  }
  source: 'website' | 'phone' | 'walk_in' | 'referral'
  promoCode?: string
  assignedStaff?: mongoose.Types.ObjectId
  reminders: {
    oneDaySent: boolean
    threeDaySent: boolean
    checkOutSent: boolean
    reviewRequestSent: boolean
  }
  adminNotes?: string
  cancellationReason?: string
  cancelledAt?: Date
  cancelledBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>({
  bookingNumber: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  pet: { type: Schema.Types.ObjectId, ref: 'Pet' },
  petDetails: {
    name: { type: String, required: true },
    type: { type: String, enum: ['cat', 'dog'], required: true },
    breed: { type: String },
    size: { type: String, enum: ['small', 'medium', 'large'] },
    specialNeeds: { type: String },
    medications: { type: String },
    dietaryRequirements: { type: String },
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  actualCheckIn: { type: Date },
  actualCheckOut: { type: Date },
  status: { type: String, enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'deposit_paid', 'paid', 'refunded', 'failed'], default: 'pending' },
  pricing: {
    dailyRate: { type: Number, required: true },
    days: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    addOnsTotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountReason: { type: String },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  paidAmount: { type: Number, default: 0 },
  refundedAmount: { type: Number, default: 0 },
  addOns: [{ type: String }],
  specialRequests: { type: String },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
  },
  source: { type: String, enum: ['website', 'phone', 'walk_in', 'referral'], default: 'website' },
  promoCode: { type: String },
  assignedStaff: { type: Schema.Types.ObjectId, ref: 'User' },
  reminders: {
    oneDaySent: { type: Boolean, default: false },
    threeDaySent: { type: Boolean, default: false },
    checkOutSent: { type: Boolean, default: false },
    reviewRequestSent: { type: Boolean, default: false },
  },
  adminNotes: { type: String },
  cancellationReason: { type: String },
  cancelledAt: { type: Date },
  cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

BookingSchema.index({ bookingNumber: 1 })
BookingSchema.index({ user: 1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ startDate: 1, endDate: 1 })
BookingSchema.index({ 'customer.email': 1 })

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)
