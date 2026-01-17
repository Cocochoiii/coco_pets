'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, PawPrint, Home, Phone, Mail, MapPin, Clock, Shield } from 'lucide-react'
import confetti from 'canvas-confetti'

interface BookingDetails {
    petName: string
    service: string
    checkIn: string
    checkOut: string
    totalPrice: number
}

function SuccessContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [booking, setBooking] = useState<BookingDetails | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Trigger confetti
        const duration = 3 * 1000
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#D4A5A5', '#EEE1DB', '#C08B8B']
            })
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#D4A5A5', '#EEE1DB', '#C08B8B']
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }
        frame()

        // Verify payment
        const verifyPayment = async () => {
            if (!sessionId) {
                setLoading(false)
                return
            }

            try {
                const res = await fetch(`/api/booking/verify?session_id=${sessionId}`)
                const data = await res.json()
                if (data.success && data.booking) {
                    setBooking(data.booking)
                }
            } catch (error) {
                console.error('Error verifying payment:', error)
            } finally {
                setLoading(false)
            }
        }

        verifyPayment()
    }, [sessionId])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-300 via-white to-primary-200/30 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <PawPrint className="w-12 h-12 text-primary-600" />
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-300 via-white to-primary-200/30 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-soft-2xl p-8 text-center">
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-success/10 rounded-full mx-auto mb-6 flex items-center justify-center"
                    >
                        <CheckCircle className="w-14 h-14 text-success" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-neutral-900 mb-2"
                    >
                        Booking Confirmed!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-neutral-600 mb-8"
                    >
                        Your payment was successful and your booking is confirmed.
                    </motion.p>

                    {/* Booking Details */}
                    {booking && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-neutral-50 rounded-2xl p-6 mb-8 text-left"
                        >
                            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary-600" />
                                Booking Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Pet</span>
                                    <span className="font-medium text-neutral-900">{booking.petName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Service</span>
                                    <span className="font-medium text-neutral-900">{booking.service}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Check-in</span>
                                    <span className="font-medium text-neutral-900">{new Date(booking.checkIn).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Check-out</span>
                                    <span className="font-medium text-neutral-900">{new Date(booking.checkOut).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-neutral-200">
                                    <span className="font-semibold text-neutral-900">Total Paid</span>
                                    <span className="font-bold text-primary-700">${booking.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* What's Next */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-primary-50 rounded-2xl p-6 mb-8 text-left"
                    >
                        <h3 className="font-semibold text-neutral-900 mb-4">What&apos;s Next?</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-4 h-4 text-primary-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900 text-sm">Confirmation Email</p>
                                    <p className="text-xs text-neutral-500">Check your inbox for booking details</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <PawPrint className="w-4 h-4 text-primary-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900 text-sm">Prepare Your Pet</p>
                                    <p className="text-xs text-neutral-500">Bring vaccination records and favorite items</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-4 h-4 text-primary-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900 text-sm">Drop Off</p>
                                    <p className="text-xs text-neutral-500">Arrive between 9 AM - 6 PM on check-in day</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-sm text-neutral-500 mb-8"
                    >
                        <p className="mb-2">Questions? Contact us:</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="tel:+16177628179" className="flex items-center gap-1 text-primary-600 hover:underline">
                                <Phone className="w-4 h-4" /> (617) 762-8179
                            </a>
                            <a href="mailto:choi.coco0328@gmail.com" className="flex items-center gap-1 text-primary-600 hover:underline">
                                <Mail className="w-4 h-4" /> Email
                            </a>
                        </div>
                        <p className="flex items-center justify-center gap-1 mt-2">
                            <MapPin className="w-4 h-4" /> Wellesley Hills, MA 02481
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Link
                            href="/portal"
                            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-soft-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-5 h-5" />
                            View My Bookings
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 bg-neutral-100 text-neutral-700 py-3 px-6 rounded-xl font-semibold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </motion.div>

                    {/* Security Badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400"
                    >
                        <Shield className="w-4 h-4" />
                        Secured by Stripe
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-primary-300 via-white to-primary-200/30 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
