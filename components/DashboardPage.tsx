'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    User, Calendar, Heart, CreditCard, Settings, LogOut, PawPrint, Plus,
    Edit2, Trash2, Clock, Star, Gift, MessageCircle, CheckCircle, TrendingUp,
    Award, Cat, Dog, Home, ChevronRight, Phone, Mail, MapPin, Bell, Shield,
    Loader2  // ← 新增
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserData {
    name: string
    email: string
    phone?: string
    role: 'admin' | 'user'
    permissions: string[]
    loyaltyPoints?: number
    referralCode?: string
    createdAt?: string
}

interface Pet {
    id: string
    name: string
    type: 'cat' | 'dog'
    breed: string
    age: string
    specialNeeds?: string
    vaccinated: boolean
}

interface Booking {
    id: string
    petName: string
    petType: 'cat' | 'dog'
    checkIn: string
    checkOut: string
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
    paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'  // ← 新增
    totalPrice: number
    addOns?: string[]
}

type TabType = 'overview' | 'bookings' | 'pets' | 'settings'

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(null)
    const [pets, setPets] = useState<Pet[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [loading, setLoading] = useState(true)
    const [showAddPet, setShowAddPet] = useState(false)
    const [newPet, setNewPet] = useState<Partial<Pet>>({ type: 'cat', vaccinated: true })
    const [payingBookingId, setPayingBookingId] = useState<string | null>(null)  // ← 新增

    useEffect(() => {
        // 检查登录状态
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
            router.push('/client-portal')
            return
        }

        try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)

            // 加载本地存储的宠物和预订
            const storedPets = localStorage.getItem('pets')
            if (storedPets) {
                setPets(JSON.parse(storedPets))
            }

            const storedBookings = localStorage.getItem('bookings')
            if (storedBookings) {
                const allBookings = JSON.parse(storedBookings)
                // 只显示当前用户的预订
                const userBookings = allBookings.filter((b: any) => b.userEmail === parsedUser.email)
                setBookings(userBookings)
            }
        } catch {
            router.push('/client-portal')
        }

        setLoading(false)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('user')
        sessionStorage.setItem('fromLogout', 'true')
        window.dispatchEvent(new Event('userLogout'))
        toast.success('Logged out successfully')
        router.push('/')
    }

    const handleAddPet = () => {
        if (!newPet.name || !newPet.breed) {
            toast.error('Please fill in pet name and breed')
            return
        }

        const pet: Pet = {
            id: `pet_${Date.now()}`,
            name: newPet.name || '',
            type: newPet.type || 'cat',
            breed: newPet.breed || '',
            age: newPet.age || '',
            specialNeeds: newPet.specialNeeds,
            vaccinated: newPet.vaccinated || false
        }

        const updatedPets = [...pets, pet]
        setPets(updatedPets)
        localStorage.setItem('pets', JSON.stringify(updatedPets))

        setNewPet({ type: 'cat', vaccinated: true })
        setShowAddPet(false)
        toast.success(`${pet.name} added successfully!`)
    }

    const handleDeletePet = (petId: string) => {
        if (!confirm('Are you sure you want to remove this pet?')) return

        const updatedPets = pets.filter(p => p.id !== petId)
        setPets(updatedPets)
        localStorage.setItem('pets', JSON.stringify(updatedPets))
        toast.success('Pet removed')
    }

    const handleUpdateProfile = (data: Partial<UserData>) => {
        if (user) {
            const updated = { ...user, ...data }
            setUser(updated)
            localStorage.setItem('user', JSON.stringify(updated))
            window.dispatchEvent(new Event('userLogin'))
            toast.success('Profile updated!')
        }
    }

    // ============ 新增: Pay Now 功能 ============
    const handlePayNow = async (booking: Booking) => {
        setPayingBookingId(booking.id)

        try {
            const nights = Math.ceil(
                (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
            ) || 1

            const res = await fetch('/api/booking/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    booking: {
                        serviceType: booking.petType === 'cat' ? 'cat_boarding' : 'dog_boarding',
                        petType: booking.petType,
                        checkInDate: booking.checkIn,
                        checkOutDate: booking.checkOut,
                        pets: [{
                            name: booking.petName,
                            type: booking.petType,
                            breed: '',
                            weight: '30'
                        }],
                        totalPrice: booking.totalPrice,
                        nights: nights
                    }
                })
            })

            const data = await res.json()

            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error(data.error || 'Failed to create checkout session')
            }
        } catch (error: any) {
            console.error('Payment error:', error)
            toast.error(error.message || 'Unable to process payment. Please try again.')
        } finally {
            setPayingBookingId(null)
        }
    }

    const needsPayment = (booking: Booking) => {
        return booking.paymentStatus !== 'paid' &&
            ['pending', 'confirmed'].includes(booking.status)
    }
    // ============ 新增结束 ============

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <PawPrint className="w-12 h-12 text-primary-700" />
                </motion.div>
            </div>
        )
    }

    if (!user) return null

    const upcomingBookings = bookings.filter(b => ['pending', 'confirmed', 'active'].includes(b.status))
    const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status))

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700'
            case 'pending': return 'bg-yellow-100 text-yellow-700'
            case 'active': return 'bg-blue-100 text-blue-700'
            case 'completed': return 'bg-neutral-100 text-neutral-600'
            case 'cancelled': return 'bg-red-100 text-red-600'
            default: return 'bg-neutral-100 text-neutral-600'
        }
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        { id: 'pets', label: 'My Pets', icon: Heart },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 text-neutral-700 hover:text-primary-700">
                            <Home className="w-5 h-5" />
                            <span className="font-medium hidden sm:inline">Back to Home</span>
                        </Link>
                        <h1 className="text-lg font-bold text-neutral-900">My Dashboard</h1>
                        <div className="flex items-center gap-2">
                            {user.role === 'admin' && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">Admin</span>
                            )}
                            <button onClick={handleLogout} className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-primary-700 to-primary-800 rounded-2xl p-6 mb-8 text-white"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Welcome back, {user.name}!</h2>
                            <p className="text-primary-100">Manage your pet&apos;s stays and account settings</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                                <span className="font-semibold">{user.loyaltyPoints || 0} Points</span>
                            </div>
                            <Link
                                href="/#booking"
                                className="bg-white text-primary-700 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                New Booking
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-soft-lg p-6 sticky top-24">
                            {/* User Info */}
                            <div className="text-center mb-6 pb-6 border-b border-neutral-100">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <h3 className="font-semibold text-neutral-900">{user.name}</h3>
                                <p className="text-sm text-neutral-500">{user.email}</p>
                                <div className="mt-3 inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                                    <Award className="w-3 h-3" />
                                    {user.role === 'admin' ? 'Admin' : 'Member'}
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabType)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                            activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50'
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

                            {/* Referral Code */}
                            <div className="mt-6 p-4 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Gift className="w-4 h-4 text-primary-600" />
                                    <span className="text-sm font-medium text-neutral-700">Your Referral Code</span>
                                </div>
                                <div className="bg-white px-3 py-2 rounded-lg border border-primary-200 text-center">
                                    <span className="font-mono font-bold text-primary-700 tracking-wider">{user.referralCode || 'N/A'}</span>
                                </div>
                                <p className="text-xs text-neutral-500 mt-2">Share and both get 15% off!</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    {/* Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <span className="text-2xl font-bold text-neutral-900">{upcomingBookings.length}</span>
                                            </div>
                                            <h3 className="font-medium text-neutral-600">Upcoming Stays</h3>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                                    <Heart className="w-6 h-6 text-pink-600" />
                                                </div>
                                                <span className="text-2xl font-bold text-neutral-900">{pets.length}</span>
                                            </div>
                                            <h3 className="font-medium text-neutral-600">Registered Pets</h3>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                    <CreditCard className="w-6 h-6 text-green-600" />
                                                </div>
                                                <span className="text-2xl font-bold text-neutral-900">${bookings.reduce((sum, b) => sum + b.totalPrice, 0)}</span>
                                            </div>
                                            <h3 className="font-medium text-neutral-600">Total Spent</h3>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <Link href="/#booking" className="flex flex-col items-center gap-2 p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all">
                                                <Calendar className="w-8 h-8 text-primary-600" />
                                                <span className="text-sm font-medium text-neutral-700">Book a Stay</span>
                                            </Link>
                                            <button onClick={() => { setActiveTab('pets'); setShowAddPet(true); }} className="flex flex-col items-center gap-2 p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all">
                                                <PawPrint className="w-8 h-8 text-primary-600" />
                                                <span className="text-sm font-medium text-neutral-700">Add a Pet</span>
                                            </button>
                                            <Link href="/#contact" className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all">
                                                <MessageCircle className="w-8 h-8 text-blue-600" />
                                                <span className="text-sm font-medium text-neutral-700">Contact Us</span>
                                            </Link>
                                            <button onClick={() => setActiveTab('settings')} className="flex flex-col items-center gap-2 p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-all">
                                                <Settings className="w-8 h-8 text-neutral-600" />
                                                <span className="text-sm font-medium text-neutral-700">Settings</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recent Bookings */}
                                    {upcomingBookings.length > 0 && (
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-semibold text-neutral-900">Upcoming Stays</h2>
                                                <button onClick={() => setActiveTab('bookings')} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                                                    View All <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {upcomingBookings.slice(0, 3).map((booking) => (
                                                    <div key={booking.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                                                {booking.petType === 'cat' ? <Cat className="w-6 h-6 text-primary-600" /> : <Dog className="w-6 h-6 text-primary-600" />}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-neutral-900">{booking.petName}</h4>
                                                                <p className="text-sm text-neutral-500">
                                                                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                            </span>
                                                            {/* ← 新增 Pay Now 按钮 */}
                                                            {needsPayment(booking) && (
                                                                <button
                                                                    onClick={() => handlePayNow(booking)}
                                                                    disabled={payingBookingId === booking.id}
                                                                    className="flex items-center gap-1 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full hover:bg-primary-700 disabled:opacity-50 transition-all"
                                                                >
                                                                    {payingBookingId === booking.id ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                                    ) : (
                                                                        <CreditCard className="w-3 h-3" />
                                                                    )}
                                                                    Pay Now
                                                                </button>
                                                            )}
                                                        </div>
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
                                                <button onClick={() => setActiveTab('pets')} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                                                    Manage <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {pets.slice(0, 4).map((pet) => (
                                                    <div key={pet.id} className="text-center p-4 bg-neutral-50 rounded-xl">
                                                        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                                                            {pet.type === 'cat' ? <Cat className="w-8 h-8 text-primary-600" /> : <Dog className="w-8 h-8 text-primary-600" />}
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
                                <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-neutral-900">My Bookings</h2>
                                        <Link href="/#booking" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all flex items-center gap-2">
                                            <Plus className="w-4 h-4" />New Booking
                                        </Link>
                                    </div>

                                    {bookings.length > 0 ? (
                                        <>
                                            {upcomingBookings.length > 0 && (
                                                <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                                                        <Clock className="w-5 h-5 text-primary-600" />
                                                        Upcoming ({upcomingBookings.length})
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {upcomingBookings.map((booking) => (
                                                            <div key={booking.id} className="p-4 border border-primary-100 rounded-xl bg-white">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-start gap-4">
                                                                        <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                                                                            {booking.petType === 'cat' ? <Cat className="w-7 h-7 text-primary-600" /> : <Dog className="w-7 h-7 text-primary-600" />}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold text-neutral-900">{booking.petName}</h4>
                                                                            <p className="text-sm text-neutral-500">
                                                                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                                        </span>
                                                                        <p className="mt-2 font-semibold text-neutral-900">${booking.totalPrice}</p>
                                                                        {/* ← 新增 Pay Now 按钮 */}
                                                                        {needsPayment(booking) && (
                                                                            <button
                                                                                onClick={() => handlePayNow(booking)}
                                                                                disabled={payingBookingId === booking.id}
                                                                                className="mt-2 flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all"
                                                                            >
                                                                                {payingBookingId === booking.id ? (
                                                                                    <>
                                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                                        Processing...
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <CreditCard className="w-4 h-4" />
                                                                                        Pay Now
                                                                                    </>
                                                                                )}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {pastBookings.length > 0 && (
                                                <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                        Past Stays ({pastBookings.length})
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {pastBookings.map((booking) => (
                                                            <div key={booking.id} className="p-4 bg-neutral-50 rounded-xl">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center">
                                                                            {booking.petType === 'cat' ? <Cat className="w-6 h-6 text-neutral-500" /> : <Dog className="w-6 h-6 text-neutral-500" />}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-medium text-neutral-700">{booking.petName}</h4>
                                                                            <p className="text-sm text-neutral-500">
                                                                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="bg-white rounded-2xl p-12 shadow-soft-md text-center">
                                            <Calendar className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                                            <h3 className="font-semibold text-neutral-900 mb-2">No bookings yet</h3>
                                            <p className="text-neutral-500 mb-6">Book your first stay with us!</p>
                                            <Link href="/#booking" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all">
                                                <Calendar className="w-5 h-5" />
                                                Book Now
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Pets Tab */}
                            {activeTab === 'pets' && (
                                <motion.div key="pets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-neutral-900">My Pets</h2>
                                        <button onClick={() => setShowAddPet(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all flex items-center gap-2">
                                            <Plus className="w-4 h-4" />Add Pet
                                        </button>
                                    </div>

                                    {/* Add Pet Form */}
                                    <AnimatePresence>
                                        {showAddPet && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 shadow-soft-md overflow-hidden">
                                                <h3 className="font-semibold text-neutral-900 mb-4">Add New Pet</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Pet Name *</label>
                                                        <input
                                                            type="text"
                                                            value={newPet.name || ''}
                                                            onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                                                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                            placeholder="e.g., Luna"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Type *</label>
                                                        <select
                                                            value={newPet.type || 'cat'}
                                                            onChange={(e) => setNewPet({ ...newPet, type: e.target.value as 'cat' | 'dog' })}
                                                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        >
                                                            <option value="cat">Cat</option>
                                                            <option value="dog">Dog</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Breed *</label>
                                                        <input
                                                            type="text"
                                                            value={newPet.breed || ''}
                                                            onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                                                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                            placeholder="e.g., British Shorthair"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                                                        <input
                                                            type="text"
                                                            value={newPet.age || ''}
                                                            onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                                                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                            placeholder="e.g., 2 years"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Special Needs / Notes</label>
                                                        <textarea
                                                            value={newPet.specialNeeds || ''}
                                                            onChange={(e) => setNewPet({ ...newPet, specialNeeds: e.target.value })}
                                                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                            rows={2}
                                                            placeholder="Allergies, medications, special requirements..."
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={newPet.vaccinated || false}
                                                                onChange={(e) => setNewPet({ ...newPet, vaccinated: e.target.checked })}
                                                                className="w-4 h-4 text-primary-600 rounded"
                                                            />
                                                            <span className="text-sm text-neutral-700">Vaccinations up to date</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 mt-6">
                                                    <button onClick={handleAddPet} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-all">
                                                        Save Pet
                                                    </button>
                                                    <button onClick={() => setShowAddPet(false)} className="px-6 py-2 border border-neutral-200 rounded-lg font-semibold hover:bg-neutral-50 transition-all">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Pet List */}
                                    {pets.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {pets.map((pet) => (
                                                <motion.div key={pet.id} className="bg-white rounded-2xl p-6 shadow-soft-md" whileHover={{ y: -2 }}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                                                                {pet.type === 'cat' ? <Cat className="w-8 h-8 text-primary-600" /> : <Dog className="w-8 h-8 text-primary-600" />}
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
                                                        <button onClick={() => handleDeletePet(pet.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl p-12 shadow-soft-md text-center">
                                            <PawPrint className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                                            <h3 className="font-semibold text-neutral-900 mb-2">No pets registered yet</h3>
                                            <p className="text-neutral-500 mb-6">Add your furry friends to make booking easier!</p>
                                            <button onClick={() => setShowAddPet(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all">
                                                <Plus className="w-5 h-5" />
                                                Add Your First Pet
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <h2 className="text-2xl font-bold text-neutral-900">Account Settings</h2>

                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        <h3 className="font-semibold text-neutral-900 mb-4">Profile Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={user.name}
                                                    onBlur={(e) => handleUpdateProfile({ name: e.target.value })}
                                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                                                <input type="email" value={user.email} disabled className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500" />
                                                <p className="text-xs text-neutral-400 mt-1">Email cannot be changed</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    defaultValue={user.phone || ''}
                                                    onBlur={(e) => handleUpdateProfile({ phone: e.target.value })}
                                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="(617) 123-4567"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        <h3 className="font-semibold text-neutral-900 mb-4">Account Details</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between py-2 border-b border-neutral-100">
                                                <span className="text-neutral-500">Member Since</span>
                                                <span className="text-neutral-900">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-neutral-100">
                                                <span className="text-neutral-500">Loyalty Points</span>
                                                <span className="text-neutral-900 font-semibold">{user.loyaltyPoints || 0} pts</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span className="text-neutral-500">Referral Code</span>
                                                <span className="font-mono text-primary-700">{user.referralCode || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        <h3 className="font-semibold text-neutral-900 mb-4">Contact Support</h3>
                                        <div className="space-y-3">
                                            <a href="tel:+16177628179" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-all">
                                                <Phone className="w-5 h-5 text-primary-600" />
                                                <span className="text-neutral-700">(617) 762-8179</span>
                                            </a>
                                            <a href="mailto:choi.coco0328@gmail.com" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-all">
                                                <Mail className="w-5 h-5 text-primary-600" />
                                                <span className="text-neutral-700">choi.coco0328@gmail.com</span>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}