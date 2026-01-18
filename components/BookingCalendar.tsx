'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar, ChevronLeft, ChevronRight, X, Cat, Dog, Camera, Sparkles,
    Scissors, Car, Star, Info, CreditCard, CheckCircle, Shield, ArrowRight
} from 'lucide-react'
import {
    format, addMonths, subMonths, getDaysInMonth, startOfMonth,
    getDay, isSameDay, isBefore, differenceInDays
} from 'date-fns'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

interface UserData {
    name: string
    email: string
    role: string
}

interface BookingData {
    petType: 'cat' | 'dog'
    petName: string
    petBreed: string
    petAge: string
    specialNeeds: string
    checkIn: Date | null
    checkOut: Date | null
    addOns: string[]
}

const ADD_ONS = [
    { id: 'photos', name: 'Daily Photo Updates', price: 5, perDay: true, icon: Camera },
    { id: 'grooming', name: 'Basic Grooming', price: 25, perDay: false, icon: Scissors },
    { id: 'playtime', name: 'Extra Playtime', price: 10, perDay: false, icon: Sparkles },
    { id: 'pickup', name: 'Pickup Service', price: 20, perDay: false, icon: Car },
]

export default function BookingCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })
    const [showModal, setShowModal] = useState(false)
    const [modalStep, setModalStep] = useState(1)
    const [user, setUser] = useState<UserData | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const [bookingData, setBookingData] = useState<BookingData>({
        petType: 'cat',
        petName: '',
        petBreed: '',
        petAge: '',
        specialNeeds: '',
        checkIn: null,
        checkOut: null,
        addOns: []
    })

    useEffect(() => {
        const checkUser = () => {
            try {
                const storedUser = localStorage.getItem('user')
                if (storedUser) {
                    const parsed = JSON.parse(storedUser)
                    setUser(parsed)
                } else {
                    setUser(null)
                }
            } catch {
                setUser(null)
            }
        }

        checkUser()
        window.addEventListener('storage', checkUser)
        window.addEventListener('userLogin', checkUser)
        window.addEventListener('userLogout', checkUser)
        window.addEventListener('focus', checkUser)
        const interval = setInterval(checkUser, 1000)

        return () => {
            window.removeEventListener('storage', checkUser)
            window.removeEventListener('userLogin', checkUser)
            window.removeEventListener('userLogout', checkUser)
            window.removeEventListener('focus', checkUser)
            clearInterval(interval)
        }
    }, [])

    const getAvailability = useCallback((date: Date) => {
        const month = date.getMonth()
        const day = date.getDate()

        if ((month === 10 && day >= 21) || (month === 11 && day <= 9)) {
            return { available: 0, total: 5 }
        }
        if (month === 11 && day >= 10 && day <= 30) {
            const random = day % 4
            if (random === 0 || random === 1) return { available: 0, total: 5 }
            if (random === 2) return { available: 1, total: 5 }
            return { available: 2, total: 5 }
        }
        return { available: 4, total: 5 }
    }, [])

    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfWeek = getDay(startOfMonth(currentMonth))
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const handleDateClick = (date: Date) => {
        if (isBefore(date, today)) {
            toast.error('Cannot select past dates')
            return
        }

        const availability = getAvailability(date)
        if (availability.available === 0) {
            toast.error('This date is fully booked')
            return
        }

        if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
            setSelectedRange({ start: date, end: null })
            setBookingData(prev => ({ ...prev, checkIn: date, checkOut: null }))
        } else {
            if (isBefore(date, selectedRange.start)) {
                setSelectedRange({ start: date, end: selectedRange.start })
                setBookingData(prev => ({ ...prev, checkIn: date, checkOut: selectedRange.start }))
            } else {
                setSelectedRange({ start: selectedRange.start, end: date })
                setBookingData(prev => ({ ...prev, checkIn: selectedRange.start, checkOut: date }))
            }
        }
    }

    const calculatePrice = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0
        const nights = differenceInDays(bookingData.checkOut, bookingData.checkIn)
        if (nights <= 0) return 0

        const basePrice = bookingData.petType === 'cat' ? 25 : 40
        let total = basePrice * nights

        bookingData.addOns.forEach(addOnId => {
            const addOn = ADD_ONS.find(a => a.id === addOnId)
            if (addOn) {
                total += addOn.perDay ? addOn.price * nights : addOn.price
            }
        })

        if (nights >= 7) total *= 0.9
        return Math.round(total * 100) / 100
    }

    const getNights = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0
        return differenceInDays(bookingData.checkOut, bookingData.checkIn)
    }

    const handleContinueBooking = () => {
        if (!selectedRange.start || !selectedRange.end) {
            toast.error('Please select check-in and check-out dates')
            return
        }

        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            toast.error('Please log in to complete booking', {
                icon: '🔐',
                duration: 4000
            })
            setTimeout(() => {
                window.location.href = '/client-portal?redirect=' + encodeURIComponent('/#booking')
            }, 1000)
            return
        }

        setShowModal(true)
        setModalStep(1)
    }

    const handlePayment = async () => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            toast.error('Please log in to complete booking')
            setShowModal(false)
            window.location.href = '/client-portal?redirect=' + encodeURIComponent('/#booking')
            return
        }

        if (!bookingData.petName.trim()) {
            toast.error('Please enter your pet\'s name')
            return
        }

        setIsProcessing(true)

        try {
            const res = await fetch('/api/booking/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    serviceType: 'overnight',
                    pets: [{
                        name: bookingData.petName,
                        type: bookingData.petType,
                        breed: bookingData.petBreed,
                        age: bookingData.petAge,
                        specialNeeds: bookingData.specialNeeds
                    }],
                    checkIn: bookingData.checkIn?.toISOString(),
                    checkOut: bookingData.checkOut?.toISOString(),
                    addOns: bookingData.addOns,
                    totalPrice: calculatePrice()
                })
            })

            const data = await res.json()
            if (data.success && data.url) {
                window.location.href = data.url
                return
            }
        } catch (err) {
            console.log('API payment not available, using local mode')
        }

        await new Promise(r => setTimeout(r, 1500))

        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
        const currentUser = JSON.parse(storedUser)
        const newBooking = {
            id: `BK${Date.now()}`,
            petName: bookingData.petName,
            petType: bookingData.petType,
            petBreed: bookingData.petBreed,
            petAge: bookingData.petAge,
            specialNeeds: bookingData.specialNeeds,
            checkIn: bookingData.checkIn?.toISOString(),
            checkOut: bookingData.checkOut?.toISOString(),
            addOns: bookingData.addOns,
            totalPrice: calculatePrice(),
            status: 'confirmed',
            userEmail: currentUser.email,
            userName: currentUser.name,
            createdAt: new Date().toISOString()
        }
        bookings.push(newBooking)
        localStorage.setItem('bookings', JSON.stringify(bookings))

        setIsProcessing(false)
        setShowModal(false)

        toast.success(
            <div>
                <p className="font-semibold">Booking Confirmed!</p>
                <p className="text-sm">Thank you, {currentUser.name}! Check your dashboard for details.</p>
            </div>,
            { duration: 5000 }
        )

        setSelectedRange({ start: null, end: null })
        setBookingData({
            petType: 'cat', petName: '', petBreed: '', petAge: '',
            specialNeeds: '', checkIn: null, checkOut: null, addOns: []
        })
    }

    const isInRange = (date: Date) => {
        if (!selectedRange.start) return false
        if (!selectedRange.end) return isSameDay(date, selectedRange.start)
        return (isSameDay(date, selectedRange.start) || isSameDay(date, selectedRange.end)) ||
            (date > selectedRange.start && date < selectedRange.end)
    }

    const isRangeStart = (date: Date) => selectedRange.start && isSameDay(date, selectedRange.start)
    const isRangeEnd = (date: Date) => selectedRange.end && isSameDay(date, selectedRange.end)

    return (
        <section id="booking" className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white via-primary-50/30 to-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                {/* ===== Header with SVG Decorations ===== */}
                <motion.div
                    className="text-center mb-10 md:mb-12 relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Mobile SVGs - 标题上方居中显示 */}
                    <div className="flex items-center justify-center gap-10 mb-4 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src="/svgs/booking-decoration.svg"
                                alt="Booking decoration left"
                                width={80}
                                height={80}
                                className="w-36 h-36 opacity-90"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Image
                                src="/svgs/booking-decoration2.svg"
                                alt="Booking decoration right"
                                width={80}
                                height={80}
                                className="w-36 h-36 opacity-90"
                            />
                        </motion.div>
                    </div>

                    {/* Desktop Left SVG */}
                    <motion.div
                        className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-0"
                        initial={{ opacity: 0, x: -50, scale: 0.8 }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                            scale: 1.8,
                            y: [0, -15, 0]
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }
                        }}
                    >
                        <Image
                            src="/svgs/booking-decoration.svg"
                            alt="Booking decoration left"
                            width={200}
                            height={200}
                            className="w-36 h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 opacity-90"
                        />
                    </motion.div>

                    {/* Desktop Right SVG */}
                    <motion.div
                        className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-0"
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                            scale: 1.8,
                            y: [0, 15, 0]
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.5
                            }
                        }}
                    >
                        <Image
                            src="/svgs/booking-decoration2.svg"
                            alt="Booking decoration right"
                            width={200}
                            height={200}
                            className="w-36 h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 opacity-90"
                        />
                    </motion.div>

                    {/* Center Title */}
                    <motion.div
                        className="relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-primary-700 font-semibold text-sm uppercase tracking-wide">
                            Book Now
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-800 mt-2 mb-4">
                            Book Your Pet&apos;s <span className="text-gradient">Stay</span>
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-600 max-w-2xl mx-auto">
                            Select your dates and we&apos;ll take care of the rest. Secure checkout powered by Stripe.
                        </p>
                    </motion.div>
                </motion.div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Calendar */}
                        <motion.div className="lg:col-span-2 bg-white rounded-3xl shadow-soft-xl p-6 md:p-8" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            {/* Month Navigation */}
                            <div className="flex items-center justify-between mb-6">
                                <motion.button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-neutral-100 rounded-lg" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <ChevronLeft className="w-5 h-5 text-neutral-600" />
                                </motion.button>
                                <h3 className="text-xl font-bold text-neutral-900">{format(currentMonth, 'MMMM yyyy')}</h3>
                                <motion.button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-neutral-100 rounded-lg" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <ChevronRight className="w-5 h-5 text-neutral-600" />
                                </motion.button>
                            </div>

                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center text-sm font-medium text-neutral-500 py-2">{day}</div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1
                                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                                    const availability = getAvailability(date)
                                    const isPast = isBefore(date, today)
                                    const isToday = isSameDay(date, new Date())
                                    const inRange = isInRange(date)
                                    const isStart = isRangeStart(date)
                                    const isEnd = isRangeEnd(date)

                                    return (
                                        <motion.button
                                            key={day}
                                            onClick={() => handleDateClick(date)}
                                            disabled={isPast || availability.available === 0}
                                            whileHover={!isPast && availability.available > 0 ? { scale: 1.05, y: -2 } : {}}
                                            whileTap={!isPast && availability.available > 0 ? { scale: 0.95 } : {}}
                                            className={`
                                                relative p-2 md:p-3 rounded-xl transition-all
                                                ${isPast ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed' : ''}
                                                ${availability.available === 0 && !isPast ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : ''}
                                                ${!isPast && availability.available > 0 && !inRange ? 'bg-white hover:shadow-soft-lg cursor-pointer border-2 border-transparent hover:border-primary-300' : ''}
                                                ${isToday && !inRange ? 'ring-2 ring-primary-500' : ''}
                                                ${inRange && !isStart && !isEnd ? 'bg-primary-100' : ''}
                                                ${isStart || isEnd ? 'bg-primary-700 text-white' : ''}
                                            `}
                                        >
                                            <div className="text-center">
                                                <div className={`font-semibold text-sm md:text-base ${isStart || isEnd ? 'text-white' : ''}`}>{day}</div>
                                                {!isPast && (
                                                    <div className="mt-1">
                                                        {availability.available === 0 ? (
                                                            <span className="text-[10px] text-neutral-500">Full</span>
                                                        ) : availability.available <= 2 ? (
                                                            <span className={`text-[10px] font-medium ${isStart || isEnd ? 'text-primary-100' : 'text-warning'}`}>{availability.available} left</span>
                                                        ) : (
                                                            <span className={`text-[10px] ${isStart || isEnd ? 'text-primary-100' : 'text-success'}`}>Available</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-success/20 border border-success" />
                                    <span className="text-neutral-600">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-primary-700" />
                                    <span className="text-neutral-600">Selected Range</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-neutral-200" />
                                    <span className="text-neutral-600">Full</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Booking Summary Panel */}
                        <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="bg-white rounded-3xl shadow-soft-xl p-6">
                                <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary-700" />
                                    Booking Summary
                                </h3>

                                {selectedRange.start ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-neutral-500">Check-in</p>
                                                <p className="font-semibold text-neutral-900">{format(selectedRange.start, 'MMM d, yyyy')}</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-neutral-400" />
                                            <div className="text-right">
                                                <p className="text-xs text-neutral-500">Check-out</p>
                                                <p className="font-semibold text-neutral-900">{selectedRange.end ? format(selectedRange.end, 'MMM d, yyyy') : '—'}</p>
                                            </div>
                                        </div>

                                        {selectedRange.end && (
                                            <div className="text-center py-2 bg-primary-50 rounded-lg">
                                                <span className="font-bold text-primary-700">{differenceInDays(selectedRange.end, selectedRange.start)} night(s)</span>
                                            </div>
                                        )}

                                        {/* Pet Type */}
                                        <div>
                                            <p className="text-sm font-medium text-neutral-700 mb-2">Pet Type</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setBookingData(prev => ({ ...prev, petType: 'cat' }))}
                                                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${bookingData.petType === 'cat' ? 'border-primary-700 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'}`}
                                                >
                                                    <Cat className={`w-5 h-5 ${bookingData.petType === 'cat' ? 'text-primary-700' : 'text-neutral-500'}`} />
                                                    <span className={bookingData.petType === 'cat' ? 'font-semibold text-primary-700' : 'text-neutral-600'}>Cat</span>
                                                </button>
                                                <button
                                                    onClick={() => setBookingData(prev => ({ ...prev, petType: 'dog' }))}
                                                    className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${bookingData.petType === 'dog' ? 'border-primary-700 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'}`}
                                                >
                                                    <Dog className={`w-5 h-5 ${bookingData.petType === 'dog' ? 'text-primary-700' : 'text-neutral-500'}`} />
                                                    <span className={bookingData.petType === 'dog' ? 'font-semibold text-primary-700' : 'text-neutral-600'}>Dog</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="border-t border-neutral-100 pt-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-neutral-600">Base Rate</span>
                                                <span className="font-medium">${bookingData.petType === 'cat' ? 25 : 40}/night</span>
                                            </div>
                                            {selectedRange.end && (
                                                <>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-neutral-600">Duration</span>
                                                        <span className="font-medium">{differenceInDays(selectedRange.end, selectedRange.start)} nights</span>
                                                    </div>
                                                    <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-neutral-200">
                                                        <span>Estimated Total</span>
                                                        <span className="text-primary-700">${((bookingData.petType === 'cat' ? 25 : 40) * differenceInDays(selectedRange.end, selectedRange.start)).toFixed(0)}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Continue Button */}
                                        <motion.button
                                            onClick={handleContinueBooking}
                                            disabled={!selectedRange.end}
                                            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${selectedRange.end ? 'bg-primary-700 text-white hover:bg-primary-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
                                            whileHover={selectedRange.end ? { scale: 1.02 } : {}}
                                            whileTap={selectedRange.end ? { scale: 0.98 } : {}}
                                        >
                                            Continue to Checkout
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-neutral-500">
                                        <Calendar className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                                        <p>Select a date to begin booking</p>
                                    </div>
                                )}

                                {/* Secure Booking Info */}
                                <div className="mt-6 p-4 bg-primary-50 rounded-xl">
                                    <div className="flex gap-3">
                                        <Shield className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-primary-900 font-medium mb-1">Secure Booking</p>
                                            <ul className="text-xs text-neutral-700 space-y-1">
                                                <li>• Payments processed securely by Stripe</li>
                                                <li>• Free cancellation up to 48 hours before</li>
                                                <li>• Instant confirmation via email</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Special Offer */}
                            <motion.div className="bg-gradient-to-br from-primary-700 to-primary-800 rounded-3xl p-6" whileHover={{ scale: 1.02 }}>
                                <h4 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-white" />
                                    Special Offer
                                </h4>
                                <p className="text-primary-100 text-sm">Book 7+ days and get 10% off automatically!</p>
                            </motion.div>

                            {/* Login Status */}
                            {!user ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-sm text-amber-800">
                                        <span className="font-medium">Please log in to complete booking.</span>{' '}
                                        <Link href="/client-portal" className="text-primary-700 underline hover:text-primary-800 font-semibold">
                                            Sign in here
                                        </Link>
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <p className="text-sm text-green-800 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Logged in as <strong>{user.name}</strong></span>
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-neutral-100 p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">Complete Your Booking</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className={`w-8 h-1 rounded-full ${modalStep >= 1 ? 'bg-primary-700' : 'bg-neutral-200'}`} />
                                        <div className={`w-8 h-1 rounded-full ${modalStep >= 2 ? 'bg-primary-700' : 'bg-neutral-200'}`} />
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                {modalStep === 1 ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Pet Name *</label>
                                            <input
                                                type="text"
                                                value={bookingData.petName}
                                                onChange={e => setBookingData(prev => ({ ...prev, petName: e.target.value }))}
                                                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0"
                                                placeholder="e.g., Luna"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Breed</label>
                                                <input
                                                    type="text"
                                                    value={bookingData.petBreed}
                                                    onChange={e => setBookingData(prev => ({ ...prev, petBreed: e.target.value }))}
                                                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0"
                                                    placeholder="e.g., British Shorthair"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                                                <input
                                                    type="text"
                                                    value={bookingData.petAge}
                                                    onChange={e => setBookingData(prev => ({ ...prev, petAge: e.target.value }))}
                                                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0"
                                                    placeholder="e.g., 2 years"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Special Needs / Notes</label>
                                            <textarea
                                                value={bookingData.specialNeeds}
                                                onChange={e => setBookingData(prev => ({ ...prev, specialNeeds: e.target.value }))}
                                                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0"
                                                rows={3}
                                                placeholder="Allergies, medications, dietary needs..."
                                            />
                                        </div>
                                        <motion.button
                                            onClick={() => setModalStep(2)}
                                            disabled={!bookingData.petName.trim()}
                                            className={`w-full py-3 rounded-xl font-semibold transition-all ${bookingData.petName.trim() ? 'bg-primary-700 text-white hover:bg-primary-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
                                            whileHover={bookingData.petName.trim() ? { scale: 1.02 } : {}}
                                        >
                                            Continue to Add-ons
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Add-ons */}
                                        <div>
                                            <h4 className="font-semibold text-neutral-900 mb-3">Add-ons & Extras</h4>
                                            <div className="space-y-2">
                                                {ADD_ONS.map(addOn => {
                                                    const isSelected = bookingData.addOns.includes(addOn.id)
                                                    const price = addOn.perDay ? addOn.price * getNights() : addOn.price
                                                    return (
                                                        <button
                                                            key={addOn.id}
                                                            onClick={() => {
                                                                setBookingData(prev => ({
                                                                    ...prev,
                                                                    addOns: isSelected ? prev.addOns.filter(id => id !== addOn.id) : [...prev.addOns, addOn.id]
                                                                }))
                                                            }}
                                                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${isSelected ? 'border-primary-700 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary-100' : 'bg-neutral-100'}`}>
                                                                    <addOn.icon className={`w-5 h-5 ${isSelected ? 'text-primary-700' : 'text-neutral-500'}`} />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className={`font-medium ${isSelected ? 'text-primary-700' : 'text-neutral-700'}`}>{addOn.name}</p>
                                                                    <p className="text-xs text-neutral-500">{addOn.perDay ? `$${addOn.price}/day` : 'One-time'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`font-semibold ${isSelected ? 'text-primary-700' : 'text-neutral-700'}`}>+${price}</span>
                                                                {isSelected && <CheckCircle className="w-5 h-5 text-primary-700" />}
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div className="bg-neutral-50 rounded-2xl p-4">
                                            <h4 className="font-semibold text-neutral-900 mb-3">Booking Summary</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-600">Pet</span>
                                                    <span className="font-medium">{bookingData.petName} ({bookingData.petType})</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-600">Dates</span>
                                                    <span className="font-medium">{bookingData.checkIn && format(bookingData.checkIn, 'MMM d')} - {bookingData.checkOut && format(bookingData.checkOut, 'MMM d')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-600">Duration</span>
                                                    <span className="font-medium">{getNights()} nights</span>
                                                </div>
                                                {getNights() >= 7 && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Long stay discount</span>
                                                        <span>-10%</span>
                                                    </div>
                                                )}
                                                <div className="border-t border-neutral-200 pt-2 mt-2">
                                                    <div className="flex justify-between text-lg font-bold">
                                                        <span>Total</span>
                                                        <span className="text-primary-700">${calculatePrice().toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3">
                                            <button onClick={() => setModalStep(1)} className="flex-1 py-3 border-2 border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition-all">
                                                Back
                                            </button>
                                            <motion.button
                                                onClick={handlePayment}
                                                disabled={isProcessing}
                                                className="flex-1 bg-primary-700 text-white py-3 rounded-xl font-semibold hover:bg-primary-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                whileHover={!isProcessing ? { scale: 1.02 } : {}}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="w-5 h-5" />
                                                        Pay ${calculatePrice().toFixed(2)}
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}