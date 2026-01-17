'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Calendar, CreditCard, Heart, Settings, LogOut,
    PawPrint, Plus, Edit2, Trash2, Clock, MapPin, Phone,
    Mail, Bell, ChevronRight, Star, Gift, MessageCircle,
    FileText, Camera, CheckCircle, XCircle, AlertCircle,
    DollarSign, TrendingUp, Award, Sparkles
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface UserData {
    _id: string
    name: string
    email: string
    phone?: string
    role: string
    loyaltyPoints: number
    referralCode: string
    createdAt: string
}

interface Pet {
    _id: string
    name: string
    type: 'cat' | 'dog'
    breed: string
    age: string
    weight?: number
    gender: 'male' | 'female'
    vaccinated: boolean
    neutered: boolean
    specialNeeds?: string
    medications?: string
    feedingInstructions?: string
    emergencyContact?: string
    image?: string
}

interface Booking {
    _id: string
    petName: string
    petType: string
    service: string
    checkIn: string
    checkOut: string
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
    totalPrice: number
    notes?: string
    createdAt: string
}

interface PaymentHistory {
    _id: string
    amount: number
    status: string
    description: string
    createdAt: string
}

type TabType = 'overview' | 'bookings' | 'pets' | 'payments' | 'messages' | 'settings'

export default function PortalPage() {
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(null)
    const [pets, setPets] = useState<Pet[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])
    const [payments, setPayments] = useState<PaymentHistory[]>([])
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [loading, setLoading] = useState(true)
    const [showAddPet, setShowAddPet] = useState(false)
    const [editingPet, setEditingPet] = useState<Pet | null>(null)

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/auth/me', { credentials: 'include' })
                const data = await res.json()
                
                if (data.success) {
                    setUser(data.user)
                    // Fetch related data
                    await Promise.all([
                        fetchPets(),
                        fetchBookings(),
                        fetchPayments()
                    ])
                } else {
                    router.push('/login?redirect=/portal')
                }
            } catch (error) {
                router.push('/login?redirect=/portal')
            } finally {
                setLoading(false)
            }
        }
        fetchUserData()
    }, [router])

    const fetchPets = async () => {
        try {
            const res = await fetch('/api/user/pets', { credentials: 'include' })
            const data = await res.json()
            if (data.success) setPets(data.pets || [])
        } catch (error) {
            console.error('Error fetching pets:', error)
        }
    }

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/user/bookings', { credentials: 'include' })
            const data = await res.json()
            if (data.success) setBookings(data.bookings || [])
        } catch (error) {
            console.error('Error fetching bookings:', error)
        }
    }

    const fetchPayments = async () => {
        try {
            const res = await fetch('/api/payments/history', { credentials: 'include' })
            const data = await res.json()
            if (data.success) setPayments(data.payments || [])
        } catch (error) {
            console.error('Error fetching payments:', error)
        }
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
        router.push('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EEE1DB] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <PawPrint className="w-12 h-12 text-primary-700" />
                </motion.div>
            </div>
        )
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        { id: 'pets', label: 'My Pets', icon: Heart },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    const upcomingBookings = bookings.filter(b => 
        ['pending', 'confirmed', 'active'].includes(b.status)
    )
    const pastBookings = bookings.filter(b => 
        ['completed', 'cancelled'].includes(b.status)
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700'
            case 'pending': return 'bg-yellow-100 text-yellow-700'
            case 'active': return 'bg-blue-100 text-blue-700'
            case 'completed': return 'bg-gray-100 text-gray-700'
            case 'cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EEE1DB] via-white to-[#D4A5A5]/20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900">
                                Welcome back, {user?.name?.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-neutral-600 mt-1">
                                Manage your pet&apos;s stays and account settings
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-primary-100 to-primary-50 px-4 py-2 rounded-full">
                                <Star className="w-5 h-5 text-primary-700 fill-primary-700" />
                                <span className="font-semibold text-primary-900">
                                    {user?.loyaltyPoints || 0} Points
                                </span>
                            </div>
                            <Link
                                href="/#booking"
                                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                New Booking
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div 
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="bg-white rounded-2xl shadow-soft-lg p-6 sticky top-24">
                            {/* User Info */}
                            <div className="text-center mb-6 pb-6 border-b border-neutral-100">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-neutral-900">{user?.name}</h3>
                                <p className="text-sm text-neutral-500">{user?.email}</p>
                                <div className="mt-3 inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                                    <Award className="w-3 h-3" />
                                    {user?.role === 'admin' ? 'Admin' : 'Member'}
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabType)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-neutral-600 hover:bg-neutral-50'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.label}</span>
                                        {tab.id === 'bookings' && upcomingBookings.length > 0 && (
                                            <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                                                {upcomingBookings.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Sign Out</span>
                            </button>

                            {/* Referral Code */}
                            <div className="mt-6 p-4 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Gift className="w-4 h-4 text-primary-600" />
                                    <span className="text-sm font-medium text-neutral-700">Your Referral Code</span>
                                </div>
                                <div className="bg-white px-3 py-2 rounded-lg border border-primary-200 text-center">
                                    <span className="font-mono font-bold text-primary-700 tracking-wider">
                                        {user?.referralCode || 'N/A'}
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-500 mt-2">
                                    Share & both get 15% off!
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div 
                        className="lg:col-span-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AnimatePresence mode="wait">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <span className="text-2xl font-bold text-neutral-900">
                                                    {upcomingBookings.length}
                                                </span>
                                            </div>
                                            <h3 className="font-medium text-neutral-600">Upcoming Stays</h3>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                                    <Heart className="w-6 h-6 text-pink-600" />
                                                </div>
                                                <span className="text-2xl font-bold text-neutral-900">
                                                    {pets.length}
                                                </span>
                                            </div>
                                            <h3 className="font-medium text-neutral-600">Registered Pets</h3>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                    <DollarSign className="w-6 h-6 text-green-600" />
                                                </div>
                                                <span className="text-2xl font-bold text-neutral-900">
                                                    ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(0)}
                                                </span>
                                            </div>
                                            <h3 className="font-medium text-neutral-600">Total Spent</h3>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <Link
                                                href="/#booking"
                                                className="flex flex-col items-center gap-2 p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all"
                                            >
                                                <Calendar className="w-8 h-8 text-primary-600" />
                                                <span className="text-sm font-medium text-neutral-700">Book a Stay</span>
                                            </Link>
                                            <button
                                                onClick={() => { setActiveTab('pets'); setShowAddPet(true); }}
                                                className="flex flex-col items-center gap-2 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-all"
                                            >
                                                <PawPrint className="w-8 h-8 text-pink-600" />
                                                <span className="text-sm font-medium text-neutral-700">Add a Pet</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('messages')}
                                                className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                                            >
                                                <MessageCircle className="w-8 h-8 text-blue-600" />
                                                <span className="text-sm font-medium text-neutral-700">Contact Us</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('settings')}
                                                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                                            >
                                                <Settings className="w-8 h-8 text-gray-600" />
                                                <span className="text-sm font-medium text-neutral-700">Settings</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Upcoming Bookings Preview */}
                                    {upcomingBookings.length > 0 && (
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-semibold text-neutral-900">Upcoming Stays</h2>
                                                <button 
                                                    onClick={() => setActiveTab('bookings')}
                                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                                                >
                                                    View All <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {upcomingBookings.slice(0, 3).map((booking) => (
                                                    <div key={booking._id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                                                {booking.petType === 'cat' ? '🐱' : '🐕'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-neutral-900">{booking.petName}</h4>
                                                                <p className="text-sm text-neutral-500">
                                                                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* My Pets Preview */}
                                    {pets.length > 0 && (
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-semibold text-neutral-900">My Pets</h2>
                                                <button 
                                                    onClick={() => setActiveTab('pets')}
                                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                                                >
                                                    Manage <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {pets.slice(0, 4).map((pet) => (
                                                    <div key={pet._id} className="text-center p-4 bg-neutral-50 rounded-xl">
                                                        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                                                            {pet.type === 'cat' ? '🐱' : '🐕'}
                                                        </div>
                                                        <h4 className="font-medium text-neutral-900">{pet.name}</h4>
                                                        <p className="text-xs text-neutral-500">{pet.breed}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Bookings Tab */}
                            {activeTab === 'bookings' && (
                                <motion.div
                                    key="bookings"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-neutral-900">My Bookings</h2>
                                        <Link
                                            href="/#booking"
                                            className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-700 transition-all flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            New Booking
                                        </Link>
                                    </div>

                                    {/* Upcoming */}
                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-primary-600" />
                                            Upcoming Stays ({upcomingBookings.length})
                                        </h3>
                                        {upcomingBookings.length > 0 ? (
                                            <div className="space-y-4">
                                                {upcomingBookings.map((booking) => (
                                                    <BookingCard key={booking._id} booking={booking} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-neutral-500">
                                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No upcoming bookings</p>
                                                <Link href="/#booking" className="text-primary-600 font-medium mt-2 inline-block">
                                                    Book a stay →
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Past */}
                                    {pastBookings.length > 0 && (
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                Past Stays ({pastBookings.length})
                                            </h3>
                                            <div className="space-y-4">
                                                {pastBookings.map((booking) => (
                                                    <BookingCard key={booking._id} booking={booking} isPast />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Pets Tab */}
                            {activeTab === 'pets' && (
                                <PetsTab 
                                    pets={pets} 
                                    setPets={setPets}
                                    showAddPet={showAddPet}
                                    setShowAddPet={setShowAddPet}
                                />
                            )}

                            {/* Payments Tab */}
                            {activeTab === 'payments' && (
                                <motion.div
                                    key="payments"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-neutral-900">Payment History</h2>
                                    
                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        {payments.length > 0 ? (
                                            <div className="space-y-4">
                                                {payments.map((payment) => (
                                                    <div key={payment._id} className="flex items-center justify-between p-4 border-b border-neutral-100 last:border-0">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                                payment.status === 'succeeded' ? 'bg-green-100' : 'bg-yellow-100'
                                                            }`}>
                                                                {payment.status === 'succeeded' ? (
                                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                                ) : (
                                                                    <Clock className="w-5 h-5 text-yellow-600" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-neutral-900">{payment.description}</p>
                                                                <p className="text-sm text-neutral-500">
                                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="font-semibold text-neutral-900">
                                                            ${payment.amount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-neutral-500">
                                                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No payment history yet</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Messages Tab */}
                            {activeTab === 'messages' && (
                                <motion.div
                                    key="messages"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-neutral-900">Messages</h2>
                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        <div className="text-center py-12">
                                            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-primary-300" />
                                            <h3 className="font-semibold text-neutral-900 mb-2">Contact Us Directly</h3>
                                            <p className="text-neutral-500 mb-6">We&apos;re here to help with any questions!</p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <a href="tel:+16177628179" className="flex items-center justify-center gap-2 bg-primary-100 text-primary-700 px-6 py-3 rounded-xl hover:bg-primary-200 transition-all">
                                                    <Phone className="w-5 h-5" />
                                                    (617) 762-8179
                                                </a>
                                                <a href="mailto:choi.coco0328@gmail.com" className="flex items-center justify-center gap-2 bg-primary-100 text-primary-700 px-6 py-3 rounded-xl hover:bg-primary-200 transition-all">
                                                    <Mail className="w-5 h-5" />
                                                    Email Us
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <SettingsTab user={user} setUser={setUser} />
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

// Booking Card Component
function BookingCard({ booking, isPast = false }: { booking: Booking; isPast?: boolean }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700'
            case 'pending': return 'bg-yellow-100 text-yellow-700'
            case 'active': return 'bg-blue-100 text-blue-700'
            case 'completed': return 'bg-gray-100 text-gray-700'
            case 'cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className={`p-4 rounded-xl border ${isPast ? 'bg-neutral-50 border-neutral-200' : 'bg-white border-primary-100'}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                        {booking.petType === 'cat' ? '🐱' : '🐕'}
                    </div>
                    <div>
                        <h4 className="font-semibold text-neutral-900">{booking.petName}</h4>
                        <p className="text-sm text-neutral-500">{booking.service}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <p className="mt-2 font-semibold text-neutral-900">${booking.totalPrice}</p>
                </div>
            </div>
            {booking.notes && (
                <p className="mt-3 text-sm text-neutral-500 bg-neutral-50 p-3 rounded-lg">
                    📝 {booking.notes}
                </p>
            )}
        </div>
    )
}

// Pets Tab Component
function PetsTab({ pets, setPets, showAddPet, setShowAddPet }: { 
    pets: Pet[]
    setPets: (pets: Pet[]) => void
    showAddPet: boolean
    setShowAddPet: (show: boolean) => void
}) {
    const [newPet, setNewPet] = useState({
        name: '',
        type: 'cat' as 'cat' | 'dog',
        breed: '',
        age: '',
        weight: '',
        gender: 'male' as 'male' | 'female',
        vaccinated: true,
        neutered: false,
        specialNeeds: '',
        medications: '',
        feedingInstructions: '',
        emergencyContact: ''
    })
    const [saving, setSaving] = useState(false)

    const handleSavePet = async () => {
        if (!newPet.name || !newPet.breed) return
        setSaving(true)
        try {
            const res = await fetch('/api/user/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newPet)
            })
            const data = await res.json()
            if (data.success) {
                setPets([...pets, data.pet])
                setShowAddPet(false)
                setNewPet({
                    name: '', type: 'cat', breed: '', age: '', weight: '',
                    gender: 'male', vaccinated: true, neutered: false,
                    specialNeeds: '', medications: '', feedingInstructions: '', emergencyContact: ''
                })
            }
        } catch (error) {
            console.error('Error saving pet:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleDeletePet = async (petId: string) => {
        if (!confirm('Are you sure you want to remove this pet?')) return
        try {
            const res = await fetch(`/api/user/pets/${petId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            const data = await res.json()
            if (data.success) {
                setPets(pets.filter(p => p._id !== petId))
            }
        } catch (error) {
            console.error('Error deleting pet:', error)
        }
    }

    return (
        <motion.div
            key="pets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">My Pets</h2>
                <button
                    onClick={() => setShowAddPet(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Pet
                </button>
            </div>

            {/* Add Pet Form */}
            <AnimatePresence>
                {showAddPet && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-soft-md overflow-hidden"
                    >
                        <h3 className="font-semibold text-neutral-900 mb-4">Add New Pet</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Pet Name *</label>
                                <input
                                    type="text"
                                    value={newPet.name}
                                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., Luna"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Type *</label>
                                <select
                                    value={newPet.type}
                                    onChange={(e) => setNewPet({ ...newPet, type: e.target.value as 'cat' | 'dog' })}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="cat">🐱 Cat</option>
                                    <option value="dog">🐕 Dog</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Breed *</label>
                                <input
                                    type="text"
                                    value={newPet.breed}
                                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., British Shorthair"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                                <input
                                    type="text"
                                    value={newPet.age}
                                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., 2 years"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Weight (lbs)</label>
                                <input
                                    type="number"
                                    value={newPet.weight}
                                    onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., 10"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Gender</label>
                                <select
                                    value={newPet.gender}
                                    onChange={(e) => setNewPet({ ...newPet, gender: e.target.value as 'male' | 'female' })}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={newPet.vaccinated}
                                        onChange={(e) => setNewPet({ ...newPet, vaccinated: e.target.checked })}
                                        className="w-4 h-4 text-primary-600 rounded"
                                    />
                                    <span className="text-sm text-neutral-700">Vaccinated</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={newPet.neutered}
                                        onChange={(e) => setNewPet({ ...newPet, neutered: e.target.checked })}
                                        className="w-4 h-4 text-primary-600 rounded"
                                    />
                                    <span className="text-sm text-neutral-700">Neutered/Spayed</span>
                                </label>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Special Needs / Notes</label>
                                <textarea
                                    value={newPet.specialNeeds}
                                    onChange={(e) => setNewPet({ ...newPet, specialNeeds: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Any allergies, medical conditions, or special requirements..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSavePet}
                                disabled={saving || !newPet.name || !newPet.breed}
                                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Pet'}
                            </button>
                            <button
                                onClick={() => setShowAddPet(false)}
                                className="px-6 py-2 border border-neutral-200 rounded-lg font-semibold hover:bg-neutral-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pets List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map((pet) => (
                    <motion.div
                        key={pet._id}
                        className="bg-white rounded-2xl p-6 shadow-soft-md"
                        whileHover={{ y: -2 }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-3xl">
                                    {pet.type === 'cat' ? '🐱' : '🐕'}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 text-lg">{pet.name}</h3>
                                    <p className="text-neutral-500">{pet.breed}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {pet.age && <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded">{pet.age}</span>}
                                        {pet.vaccinated && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Vaccinated</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDeletePet(pet._id)}
                                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {pet.specialNeeds && (
                            <p className="mt-4 text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                                📝 {pet.specialNeeds}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>

            {pets.length === 0 && !showAddPet && (
                <div className="bg-white rounded-2xl p-12 shadow-soft-md text-center">
                    <PawPrint className="w-16 h-16 mx-auto mb-4 text-primary-300" />
                    <h3 className="font-semibold text-neutral-900 mb-2">No pets registered yet</h3>
                    <p className="text-neutral-500 mb-6">Add your furry friends to make booking easier!</p>
                    <button
                        onClick={() => setShowAddPet(true)}
                        className="bg-primary-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-700 transition-all"
                    >
                        Add Your First Pet
                    </button>
                </div>
            )}
        </motion.div>
    )
}

// Settings Tab Component
function SettingsTab({ user, setUser }: { user: UserData | null; setUser: (user: UserData | null) => void }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    })
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                setUser({ ...user!, ...formData })
                setMessage('Profile updated successfully!')
                setTimeout(() => setMessage(''), 3000)
            }
        } catch (error) {
            setMessage('Error updating profile')
        } finally {
            setSaving(false)
        }
    }

    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-neutral-900">Account Settings</h2>

            <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                <h3 className="font-semibold text-neutral-900 mb-4">Profile Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500"
                        />
                        <p className="text-xs text-neutral-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="(617) 123-4567"
                        />
                    </div>
                </div>
                {message && (
                    <p className={`mt-4 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                        {message}
                    </p>
                )}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-6 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-all disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                <h3 className="font-semibold text-neutral-900 mb-4">Account Details</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                        <span className="text-neutral-500">Member Since</span>
                        <span className="text-neutral-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                        <span className="text-neutral-500">Loyalty Points</span>
                        <span className="text-neutral-900 font-semibold">{user?.loyaltyPoints || 0} pts</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-neutral-500">Referral Code</span>
                        <span className="font-mono text-primary-700">{user?.referralCode || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
