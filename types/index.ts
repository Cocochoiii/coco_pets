// types/index.ts

// User Types
export interface User {
  id: string
  _id?: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin' | 'staff'
  status: 'active' | 'suspended' | 'banned' | 'pending'
  emailVerified: boolean
  stripeCustomerId?: string
  preferences: UserPreferences
  referralCode?: string
  referredBy?: string
  totalBookings: number
  totalSpent: number
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  notifications: { email: boolean; push: boolean; sms: boolean }
  marketing: boolean
  language: string
  timezone: string
}

// Pet Types
export interface Pet {
  id: string
  _id?: string
  owner: string
  name: string
  type: 'cat' | 'dog'
  breed?: string
  color?: string
  age?: string
  dateOfBirth?: Date
  weight?: number
  size?: 'small' | 'medium' | 'large'
  gender?: 'male' | 'female'
  health: PetHealth
  vaccinations: Vaccination[]
  specialNeeds?: string
  dietaryRequirements?: string
  medications?: string[]
  allergies?: string[]
  behaviorNotes?: string
  emergencyContact?: EmergencyContact
  veterinarian?: Veterinarian
  images: string[]
  profileImage?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PetHealth {
  vaccinated: boolean
  spayedNeutered: boolean
  microchipped: boolean
  microchipNumber?: string
}

export interface Vaccination {
  name: string
  date: Date
  expiresAt?: Date
  verified: boolean
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface Veterinarian {
  name: string
  clinic: string
  phone: string
}

// Booking Types
export interface Booking {
  id: string
  _id?: string
  bookingNumber: string
  user?: string | User
  pet?: string | Pet
  petDetails: PetDetails
  startDate: Date
  endDate: Date
  actualCheckIn?: Date
  actualCheckOut?: Date
  status: BookingStatus
  paymentStatus: PaymentStatus
  pricing: BookingPricing
  paidAmount: number
  refundedAmount: number
  addOns: string[]
  specialRequests?: string
  customer: CustomerInfo
  source: 'website' | 'phone' | 'walk_in' | 'referral'
  promoCode?: string
  assignedStaff?: string | User
  reminders: BookingReminders
  adminNotes?: string
  cancellationReason?: string
  cancelledAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface PetDetails {
  name: string
  type: 'cat' | 'dog'
  breed?: string
  size?: 'small' | 'medium' | 'large'
  specialNeeds?: string
  medications?: string
  dietaryRequirements?: string
}

export interface BookingPricing {
  dailyRate: number
  days: number
  subtotal: number
  addOnsTotal: number
  discount: number
  discountReason?: string
  tax: number
  total: number
  totalFormatted?: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone?: string
  address?: string
}

export interface BookingReminders {
  oneDaySent: boolean
  threeDaySent: boolean
  checkOutSent: boolean
  reviewRequestSent: boolean
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
export type PaymentStatus = 'pending' | 'deposit_paid' | 'paid' | 'refunded' | 'failed'

// Order Types
export interface Order {
  id: string
  _id?: string
  orderId: string
  booking?: string | Booking
  user?: string | User
  customer: CustomerInfo
  stripeSessionId?: string
  stripePaymentIntentId?: string
  stripeCustomerId?: string
  amounts: OrderAmounts
  status: OrderStatus
  paymentType: 'full' | 'deposit'
  refunds: Refund[]
  receiptUrl?: string
  errorMessage?: string
  expiresAt?: Date
  paidAt?: Date
  refundedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface OrderAmounts {
  subtotal: number
  discount: number
  tax: number
  total: number
  paid: number
  refunded: number
  totalFormatted?: string
  paidFormatted?: string
  refundedFormatted?: string
}

export interface Refund {
  refundId: string
  stripeRefundId: string
  amount: number
  reason: string
  status: string
  createdAt: Date
}

export type OrderStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | 'expired' | 'cancelled'

// Notification Types
export interface Notification {
  id: string
  _id?: string
  user: string
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
}

// Chat Types
export interface ChatMessage {
  id: string
  _id?: string
  conversation: string
  sender?: string | User
  senderType: 'customer' | 'admin' | 'staff' | 'system' | 'bot'
  senderName: string
  content: string
  contentType: 'text' | 'image' | 'file' | 'system'
  attachments?: Attachment[]
  readAt?: Date
  createdAt: Date
}

export interface Attachment {
  url: string
  type: string
  name: string
}

export interface ChatConversation {
  id: string
  _id?: string
  user?: string | User
  booking?: string | Booking
  visitorInfo?: { email: string; name: string; phone?: string }
  status: 'active' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assignedTo?: string | User
  tags: string[]
  messageCount: number
  unreadCount: number
  lastMessageAt?: Date
  lastMessage?: string
  closedAt?: Date
  source: 'website' | 'mobile' | 'email'
  createdAt: Date
  updatedAt: Date
}

// Review Types
export interface Review {
  id: string
  _id?: string
  booking: string | Booking
  user: string | User
  pet?: string | Pet
  rating: number
  title?: string
  content?: string
  images: string[]
  response?: ReviewResponse
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  isFeatured: boolean
  isVerified: boolean
  helpfulCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ReviewResponse {
  content: string
  respondedBy: string
  respondedAt: Date
}

// Availability Types
export interface Availability {
  date: Date
  petType: 'cat' | 'dog'
  capacity: { total: number; booked: number; blocked: number }
  pricing?: { override?: number; multiplier?: number }
  notes?: string
  isBlocked: boolean
  blockReason?: string
}

export interface AvailabilityDay {
  date: string
  cat: AvailabilityInfo
  dog: AvailabilityInfo
}

export interface AvailabilityInfo {
  total: number
  booked: number
  blocked: number
  available: number
  pricing?: { override?: number; multiplier?: number }
  isBlocked: boolean
  blockReason?: string
  notes?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Analytics Types
export interface AnalyticsData {
  overview: {
    totalUsers: number
    totalPets: number
    totalBookings: number
    revenue: number
    revenueFormatted: string
    avgOrderValue: number
    avgOrderValueFormatted: string
    avgRating: string
  }
  bookings: {
    total: number
    completed: number
    cancelled: number
    pending: number
    confirmed: number
    completionRate: string
    cancellationRate: string
  }
  petTypeDistribution: Record<string, number>
  bookingTrend: Array<{ date: string; bookings: number; revenue: number; revenueFormatted: string }>
  recentOrders: Array<{
    orderId: string
    customer: string
    amount: number
    amountFormatted: string
    bookingNumber?: string
    date: Date
  }>
  period: string
}

// Price Calculation Types
export interface PriceCalculation {
  dailyRate: number
  days: number
  subtotal: number
  addOnsTotal: number
  discount: number
  discountReason: string
  discountPercentage: number
  tax: number
  total: number
  formatted?: {
    dailyRate: string
    subtotal: string
    addOnsTotal: string
    discount: string
    tax: string
    total: string
  }
  depositOptions?: {
    deposit30: { amount: number; formatted: string; percentage: number }
    deposit50: { amount: number; formatted: string; percentage: number }
  }
}

// Gallery Pet Data
export interface GalleryPet {
  id: string
  name: string
  type: 'cat' | 'dog'
  breed: string
  age: string
  personality: string
  isResident: boolean
  images: string[]
  videoUrl?: string
}

// Virtual Tour Types
export interface VirtualTourRoom {
  id: string
  name: string
  description: string
  image: string
  features: string[]
  category: 'common' | 'cat' | 'dog' | 'outdoor'
}
