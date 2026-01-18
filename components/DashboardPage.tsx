'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    User, Calendar, Heart, CreditCard, Settings, LogOut, PawPrint, Plus,
    Edit2, Trash2, Clock, Star, Gift, MessageCircle, CheckCircle, TrendingUp,
    Award, Cat, Dog, Home, ChevronRight, Phone, Mail, MapPin, Bell, Shield,
    Loader2, FileText, Camera, Activity, Utensils, Footprints, Droplets,
    ChevronDown, ChevronUp, Play, X, Share2, Download, Sparkles, Moon, Sun,
    Coffee, AlertCircle, Smile, Meh
} from 'lucide-react'
import toast from 'react-hot-toast'
import { ReportCard, MOOD_CONFIG } from '@/types/report-card'

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
    paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
    totalPrice: number
    addOns?: string[]
}

type TabType = 'overview' | 'bookings' | 'pets' | 'reports' | 'settings'

// ==================== Report Card Components ====================

const MoodBadge = ({ mood }: { mood: string }) => {
    const config = MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG] || MOOD_CONFIG.good
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600'
    }
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${colorClasses[config.color]}`}>
            <span>{config.emoji}</span>
            {config.label}
        </span>
    )
}

const ActivityIcon = ({ type }: { type: string }) => {
    const iconMap: Record<string, { icon: any; color: string; bg: string }> = {
        feeding: { icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-100' },
        walking: { icon: Footprints, color: 'text-green-600', bg: 'bg-green-100' },
        playtime: { icon: Sparkles, color: 'text-pink-600', bg: 'bg-pink-100' },
        potty: { icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100' },
        nap: { icon: Moon, color: 'text-slate-600', bg: 'bg-slate-100' },
        socialization: { icon: Heart, color: 'text-red-600', bg: 'bg-red-100' }
    }
    const config = iconMap[type] || { icon: Activity, color: 'text-neutral-600', bg: 'bg-neutral-100' }
    const Icon = config.icon
    return (
        <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
    )
}

const EnergyLevelBar = ({ level }: { level: number }) => {
    const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-400']
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-2 w-6 rounded-full ${i <= level ? colors[level - 1] : 'bg-neutral-200'}`} />
            ))}
            <span className="ml-2 text-sm text-neutral-600">{level}/5</span>
        </div>
    )
}

// Report Card Detail Modal
const ReportCardDetailModal = ({ report, onClose }: { report: ReportCard; onClose: () => void }) => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['media', 'activities'])
    const [showGallery, setShowGallery] = useState(false)
    const [galleryIndex, setGalleryIndex] = useState(0)

    const toggleSection = (section: string) => {
        setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section])
    }

    const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }} className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            {report.pet?.type === 'cat' ? <Cat className="w-6 h-6" /> : <Dog className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{report.pet?.name || report.booking?.petDetails?.name}&apos;s Daily Report</h2>
                            <p className="text-primary-100 text-sm">{formatDate(report.date)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MoodBadge mood={report.overallMood} />
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Staff Message */}
                    {report.messageToParent && (
                        <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-5 border border-primary-100">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-neutral-900 mb-1">Message from {report.staff?.name || 'Staff'}</h3>
                                    <p className="text-neutral-600 leading-relaxed">{report.messageToParent}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Highlights */}
                    {report.highlights?.length > 0 && (
                        <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />Today&apos;s Highlights
                            </h3>
                            <ul className="space-y-2">
                                {report.highlights.map((h, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-amber-900">
                                        <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /><span>{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Media Gallery */}
                    {report.media?.length > 0 && (
                        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                            <button onClick={() => toggleSection('media')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center"><Camera className="w-5 h-5 text-pink-600" /></div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-neutral-900">Photos & Videos</h3>
                                        <p className="text-sm text-neutral-500">{report.media.length} items</p>
                                    </div>
                                </div>
                                {expandedSections.includes('media') ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                            </button>
                            <AnimatePresence>
                                {expandedSections.includes('media') && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <div className="px-5 pb-5">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {report.media.map((item, idx) => (
                                                    <motion.div key={idx} whileHover={{ scale: 1.02 }} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group" onClick={() => { setGalleryIndex(idx); setShowGallery(true); }}>
                                                        <Image src={item.thumbnailUrl || item.url} alt="" fill className="object-cover" />
                                                        {item.type === 'video' && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><Play className="w-10 h-10 text-white fill-white" /></div>}
                                                        {item.isHighlight && <div className="absolute top-2 right-2 bg-amber-400 p-1 rounded-full"><Star className="w-3 h-3 text-white fill-white" /></div>}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Activities */}
                    {report.activities?.length > 0 && (
                        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                            <button onClick={() => toggleSection('activities')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Activity className="w-5 h-5 text-blue-600" /></div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-neutral-900">Daily Activities</h3>
                                        <p className="text-sm text-neutral-500">{report.activities.length} logged</p>
                                    </div>
                                </div>
                                {expandedSections.includes('activities') ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                            </button>
                            <AnimatePresence>
                                {expandedSections.includes('activities') && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <div className="px-5 pb-5 space-y-3">
                                            {[...report.activities].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()).map((activity, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <ActivityIcon type={activity.type} />
                                                    <div className="flex-1 bg-neutral-50 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-medium text-neutral-900 capitalize">{activity.type}</span>
                                                            <span className="text-sm text-neutral-500">{formatTime(activity.time)}</span>
                                                        </div>
                                                        {activity.duration && <p className="text-sm text-neutral-600">{activity.duration} minutes</p>}
                                                        {activity.notes && <p className="text-sm text-neutral-600 mt-1">{activity.notes}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Health */}
                    {report.healthObservations && (
                        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                            <button onClick={() => toggleSection('health')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-neutral-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><Heart className="w-5 h-5 text-green-600" /></div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-neutral-900">Health & Wellness</h3>
                                        <p className="text-sm text-neutral-500">Overall: {report.healthObservations.overallCondition}</p>
                                    </div>
                                </div>
                                {expandedSections.includes('health') ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                            </button>
                            <AnimatePresence>
                                {expandedSections.includes('health') && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <div className="px-5 pb-5 grid grid-cols-3 gap-4">
                                            <div className="bg-neutral-50 rounded-lg p-3">
                                                <p className="text-sm text-neutral-500 mb-2">Energy Level</p>
                                                <EnergyLevelBar level={report.healthObservations.energyLevel} />
                                            </div>
                                            <div className="bg-neutral-50 rounded-lg p-3">
                                                <p className="text-sm text-neutral-500 mb-2">Potty</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-blue-600 flex items-center gap-1"><Droplets className="w-4 h-4" />{report.healthObservations.peeCount}x</span>
                                                    <span className="text-amber-600">💩 {report.healthObservations.poopCount}x</span>
                                                </div>
                                            </div>
                                            <div className="bg-neutral-50 rounded-lg p-3">
                                                <p className="text-sm text-neutral-500 mb-2">Water Intake</p>
                                                <span className="font-medium text-green-600 capitalize">{report.healthObservations.waterIntake}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex items-center justify-between shrink-0">
                    <p className="text-sm text-neutral-500">Report by {report.staff?.name} • Sent {report.sentAt ? new Date(report.sentAt).toLocaleString() : 'N/A'}</p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        <Download className="w-4 h-4" />Download PDF
                    </button>
                </div>
            </motion.div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {showGallery && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setShowGallery(false)}>
                        <button onClick={() => setShowGallery(false)} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
                        <div className="max-w-4xl" onClick={(e) => e.stopPropagation()}>
                            {report.media[galleryIndex].type === 'photo' ? (
                                <Image src={report.media[galleryIndex].url} alt="" width={800} height={600} className="max-h-[80vh] w-auto object-contain rounded-lg" />
                            ) : (
                                <video src={report.media[galleryIndex].url} controls autoPlay className="max-h-[80vh] rounded-lg" />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

// ==================== Main Dashboard ====================

function DashboardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [user, setUser] = useState<UserData | null>(null)
    const [pets, setPets] = useState<Pet[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])
    const [reportCards, setReportCards] = useState<ReportCard[]>([])
    const [activeTab, setActiveTab] = useState<TabType>('overview')
    const [loading, setLoading] = useState(true)
    const [reportsLoading, setReportsLoading] = useState(false)
    const [showAddPet, setShowAddPet] = useState(false)
    const [newPet, setNewPet] = useState<Partial<Pet>>({ type: 'cat', vaccinated: true })
    const [payingBookingId, setPayingBookingId] = useState<string | null>(null)
    const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null)

    // Check URL tab parameter
    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab && ['overview', 'bookings', 'pets', 'reports', 'settings'].includes(tab)) {
            setActiveTab(tab as TabType)
        }
    }, [searchParams])

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) { router.push('/client-portal'); return }

        try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)

            const storedPets = localStorage.getItem('pets')
            if (storedPets) setPets(JSON.parse(storedPets))

            const storedBookings = localStorage.getItem('bookings')
            if (storedBookings) {
                const allBookings = JSON.parse(storedBookings)
                setBookings(allBookings.filter((b: any) => b.userEmail === parsedUser.email))
            }

            loadReportCards()
        } catch { router.push('/client-portal') }

        setLoading(false)
    }, [router])

    const loadReportCards = async () => {
        setReportsLoading(true)
        try {
            const res = await fetch('/api/report-cards', { credentials: 'include' })
            if (res.ok) {
                const data = await res.json()
                if (data.success) { setReportCards(data.data.reports); setReportsLoading(false); return }
            }
        } catch { /* API not available */ }

        // Demo data
        setReportCards([{
            _id: 'demo_1',
            booking: { _id: 'b1', bookingNumber: 'BK-DEMO', startDate: new Date().toISOString(), endDate: new Date().toISOString(), petDetails: { name: 'Luna', type: 'cat' } },
            pet: { _id: 'p1', name: 'Luna', type: 'cat', breed: 'British Shorthair', profileImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
            date: new Date().toISOString(),
            staff: { name: 'Coco' },
            activities: [
                { type: 'feeding', time: new Date(new Date().setHours(8, 0)).toISOString(), mood: 'happy' },
                { type: 'playtime', time: new Date(new Date().setHours(10, 30)).toISOString(), duration: 30, notes: 'Loved the feather toy!', mood: 'excited' },
                { type: 'nap', time: new Date(new Date().setHours(13, 0)).toISOString(), duration: 90, mood: 'calm' }
            ],
            meals: [{ time: new Date(new Date().setHours(8, 0)).toISOString(), type: 'breakfast', amount: '1/4 cup', appetiteLevel: 'excellent' }],
            healthObservations: { overallCondition: 'excellent', energyLevel: 4, poopCount: 2, peeCount: 3, waterIntake: 'normal', vomiting: false, coughing: false, limping: false, scratching: false },
            walks: [],
            media: [
                { type: 'photo', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', caption: 'Morning stretches', timestamp: new Date().toISOString(), isHighlight: true },
                { type: 'photo', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800', thumbnailUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400', timestamp: new Date().toISOString() }
            ],
            messageToParent: "Luna had a wonderful day! She was very playful and ate all her meals with great appetite. She found a sunny spot for her afternoon nap. 💕",
            overallMood: 'excellent',
            highlights: ['Ate all meals with excellent appetite', 'Had a fun 30-minute play session', 'Found a new favorite napping spot'],
            status: 'sent',
            sentAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }])
        setReportsLoading(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        sessionStorage.setItem('fromLogout', 'true')
        window.dispatchEvent(new Event('userLogout'))
        toast.success('Logged out successfully')
        router.push('/')
    }

    const handleAddPet = () => {
        if (!newPet.name || !newPet.breed) { toast.error('Please fill in pet name and breed'); return }
        const pet: Pet = { id: `pet_${Date.now()}`, name: newPet.name || '', type: newPet.type || 'cat', breed: newPet.breed || '', age: newPet.age || '', specialNeeds: newPet.specialNeeds, vaccinated: newPet.vaccinated || false }
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

    const handlePayNow = async (booking: Booking) => {
        setPayingBookingId(booking.id)
        try {
            const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1
            const res = await fetch('/api/booking/checkout', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ booking: { serviceType: booking.petType === 'cat' ? 'cat_boarding' : 'dog_boarding', petType: booking.petType, checkInDate: booking.checkIn, checkOutDate: booking.checkOut, pets: [{ name: booking.petName, type: booking.petType, breed: '', weight: '30' }], totalPrice: booking.totalPrice, nights } })
            })
            const data = await res.json()
            if (data.url) window.location.href = data.url
            else throw new Error(data.error || 'Failed to create checkout session')
        } catch (error: any) { toast.error(error.message || 'Unable to process payment') }
        finally { setPayingBookingId(null) }
    }

    const needsPayment = (booking: Booking) => booking.paymentStatus !== 'paid' && ['pending', 'confirmed'].includes(booking.status)

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
        const colors: Record<string, string> = { confirmed: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', active: 'bg-blue-100 text-blue-700', completed: 'bg-neutral-100 text-neutral-600', cancelled: 'bg-red-100 text-red-600' }
        return colors[status] || 'bg-neutral-100 text-neutral-600'
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        { id: 'pets', label: 'My Pets', icon: Heart },
        { id: 'reports', label: 'Report Cards', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-100 sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 text-neutral-700 hover:text-primary-700">
                            <Home className="w-5 h-5" /><span className="font-medium hidden sm:inline">Back to Home</span>
                        </Link>
                        <h1 className="text-lg font-bold text-neutral-900">My Dashboard</h1>
                        <div className="flex items-center gap-2">
                            {user.role === 'admin' && <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">Admin</span>}
                            <button onClick={handleLogout} className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><LogOut className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Banner */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary-700 to-primary-800 rounded-2xl p-6 mb-8 text-white">
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
                            <Link href="/#booking" className="bg-white text-primary-700 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-all flex items-center gap-2">
                                <Plus className="w-5 h-5" />New Booking
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-soft-lg p-6 sticky top-24">
                            <div className="text-center mb-6 pb-6 border-b border-neutral-100">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <h3 className="font-semibold text-neutral-900">{user.name}</h3>
                                <p className="text-sm text-neutral-500">{user.email}</p>
                                <div className="mt-3 inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                                    <Award className="w-3 h-3" />{user.role === 'admin' ? 'Admin' : 'Member'}
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.label}</span>
                                        {tab.id === 'bookings' && upcomingBookings.length > 0 && <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">{upcomingBookings.length}</span>}
                                        {tab.id === 'reports' && reportCards.length > 0 && <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{reportCards.length}</span>}
                                    </button>
                                ))}
                            </nav>

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
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6 text-blue-600" /></div>
                                                <span className="text-2xl font-bold text-neutral-900">{upcomingBookings.length}</span>
                                            </div>
                                            <h3 className="font-medium text-neutral-600">Upcoming Stays</h3>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center"><Heart className="w-6 h-6 text-pink-600" /></div>
                                                <span className="text-2xl font-bold text-neutral-900">{pets.length}</span>
                                            </div>
                                            <h3 className="font-medium text-neutral-600">Registered Pets</h3>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-amber-600" /></div>
                                                <span className="text-2xl font-bold text-neutral-900">{reportCards.length}</span>
                                            </div>
                                            <h3 className="font-medium text-neutral-600">Report Cards</h3>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CreditCard className="w-6 h-6 text-green-600" /></div>
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
                                                <Calendar className="w-8 h-8 text-primary-600" /><span className="text-sm font-medium text-neutral-700">Book a Stay</span>
                                            </Link>
                                            <button onClick={() => { setActiveTab('pets'); setShowAddPet(true); }} className="flex flex-col items-center gap-2 p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all">
                                                <PawPrint className="w-8 h-8 text-primary-600" /><span className="text-sm font-medium text-neutral-700">Add a Pet</span>
                                            </button>
                                            <button onClick={() => setActiveTab('reports')} className="flex flex-col items-center gap-2 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-all">
                                                <FileText className="w-8 h-8 text-pink-600" /><span className="text-sm font-medium text-neutral-700">View Reports</span>
                                            </button>
                                            <Link href="/#contact" className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all">
                                                <MessageCircle className="w-8 h-8 text-blue-600" /><span className="text-sm font-medium text-neutral-700">Contact Us</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Latest Report Preview */}
                                    {reportCards.length > 0 && (
                                        <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-semibold text-neutral-900">Latest Report Card</h2>
                                                <button onClick={() => setActiveTab('reports')} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
                                            </div>
                                            <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-4 border border-primary-100 cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedReport(reportCards[0])}>
                                                <div className="flex items-start gap-4">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                                                        {reportCards[0].pet?.profileImage ? <Image src={reportCards[0].pet.profileImage} alt="" width={64} height={64} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary-100">{reportCards[0].pet?.type === 'cat' ? <Cat className="w-8 h-8 text-primary-600" /> : <Dog className="w-8 h-8 text-primary-600" />}</div>}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className="font-semibold text-neutral-900">{reportCards[0].pet?.name}</h3>
                                                            <MoodBadge mood={reportCards[0].overallMood} />
                                                        </div>
                                                        <p className="text-sm text-neutral-500 mb-2">{new Date(reportCards[0].date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                                        {reportCards[0].messageToParent && <p className="text-sm text-neutral-600 line-clamp-2">{reportCards[0].messageToParent}</p>}
                                                    </div>
                                                </div>
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
                                        <Link href="/#booking" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 flex items-center gap-2"><Plus className="w-4 h-4" />New Booking</Link>
                                    </div>
                                    {bookings.length > 0 ? (
                                        <>
                                            {upcomingBookings.length > 0 && (
                                                <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-primary-600" />Upcoming ({upcomingBookings.length})</h3>
                                                    <div className="space-y-4">
                                                        {upcomingBookings.map((booking) => (
                                                            <div key={booking.id} className="p-4 border border-primary-100 rounded-xl">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-start gap-4">
                                                                        <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">{booking.petType === 'cat' ? <Cat className="w-7 h-7 text-primary-600" /> : <Dog className="w-7 h-7 text-primary-600" />}</div>
                                                                        <div>
                                                                            <h4 className="font-semibold text-neutral-900">{booking.petName}</h4>
                                                                            <p className="text-sm text-neutral-500">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                                                                        <p className="mt-2 font-semibold text-neutral-900">${booking.totalPrice}</p>
                                                                        {needsPayment(booking) && (
                                                                            <button onClick={() => handlePayNow(booking)} disabled={payingBookingId === booking.id} className="mt-2 flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50">
                                                                                {payingBookingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}Pay Now
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
                                                    <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" />Past Stays ({pastBookings.length})</h3>
                                                    <div className="space-y-4">
                                                        {pastBookings.map((booking) => (
                                                            <div key={booking.id} className="p-4 bg-neutral-50 rounded-xl flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center">{booking.petType === 'cat' ? <Cat className="w-6 h-6 text-neutral-500" /> : <Dog className="w-6 h-6 text-neutral-500" />}</div>
                                                                    <div>
                                                                        <h4 className="font-medium text-neutral-700">{booking.petName}</h4>
                                                                        <p className="text-sm text-neutral-500">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
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
                                            <Link href="/#booking" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"><Calendar className="w-5 h-5" />Book Now</Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Pets Tab */}
                            {activeTab === 'pets' && (
                                <motion.div key="pets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold text-neutral-900">My Pets</h2>
                                        <button onClick={() => setShowAddPet(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 flex items-center gap-2"><Plus className="w-4 h-4" />Add Pet</button>
                                    </div>
                                    <AnimatePresence>
                                        {showAddPet && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl p-6 shadow-soft-md overflow-hidden">
                                                <h3 className="font-semibold text-neutral-900 mb-4">Add New Pet</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div><label className="block text-sm font-medium text-neutral-700 mb-1">Pet Name *</label><input type="text" value={newPet.name || ''} onChange={(e) => setNewPet({ ...newPet, name: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g., Luna" /></div>
                                                    <div><label className="block text-sm font-medium text-neutral-700 mb-1">Type *</label><select value={newPet.type || 'cat'} onChange={(e) => setNewPet({ ...newPet, type: e.target.value as 'cat' | 'dog' })} className="w-full px-4 py-2 border border-neutral-200 rounded-lg"><option value="cat">Cat</option><option value="dog">Dog</option></select></div>
                                                    <div><label className="block text-sm font-medium text-neutral-700 mb-1">Breed *</label><input type="text" value={newPet.breed || ''} onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-lg" placeholder="e.g., British Shorthair" /></div>
                                                    <div><label className="block text-sm font-medium text-neutral-700 mb-1">Age</label><input type="text" value={newPet.age || ''} onChange={(e) => setNewPet({ ...newPet, age: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-lg" placeholder="e.g., 2 years" /></div>
                                                    <div className="md:col-span-2"><label className="block text-sm font-medium text-neutral-700 mb-1">Special Needs</label><textarea value={newPet.specialNeeds || ''} onChange={(e) => setNewPet({ ...newPet, specialNeeds: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-lg" rows={2} placeholder="Allergies, medications..." /></div>
                                                    <div className="md:col-span-2"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={newPet.vaccinated || false} onChange={(e) => setNewPet({ ...newPet, vaccinated: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" /><span className="text-sm text-neutral-700">Vaccinations up to date</span></label></div>
                                                </div>
                                                <div className="flex gap-3 mt-6">
                                                    <button onClick={handleAddPet} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700">Save Pet</button>
                                                    <button onClick={() => setShowAddPet(false)} className="px-6 py-2 border border-neutral-200 rounded-lg font-semibold hover:bg-neutral-50">Cancel</button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {pets.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {pets.map((pet) => (
                                                <motion.div key={pet.id} className="bg-white rounded-2xl p-6 shadow-soft-md" whileHover={{ y: -2 }}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">{pet.type === 'cat' ? <Cat className="w-8 h-8 text-primary-600" /> : <Dog className="w-8 h-8 text-primary-600" />}</div>
                                                            <div>
                                                                <h3 className="font-semibold text-neutral-900 text-lg">{pet.name}</h3>
                                                                <p className="text-neutral-500">{pet.breed}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {pet.age && <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded">{pet.age}</span>}
                                                                    {pet.vaccinated && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Vaccinated</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleDeletePet(pet.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl p-12 shadow-soft-md text-center">
                                            <PawPrint className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                                            <h3 className="font-semibold text-neutral-900 mb-2">No pets registered yet</h3>
                                            <p className="text-neutral-500 mb-6">Add your furry friends to make booking easier!</p>
                                            <button onClick={() => setShowAddPet(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"><Plus className="w-5 h-5" />Add Your First Pet</button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Reports Tab */}
                            {activeTab === 'reports' && (
                                <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <div><h2 className="text-2xl font-bold text-neutral-900">Report Cards</h2><p className="text-neutral-500 mt-1">Daily updates on your pet&apos;s stay</p></div>
                                    {reportsLoading ? (
                                        <div className="bg-white rounded-2xl p-12 shadow-soft-md text-center">
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><PawPrint className="w-12 h-12 mx-auto text-primary-300" /></motion.div>
                                            <p className="text-neutral-500 mt-4">Loading report cards...</p>
                                        </div>
                                    ) : reportCards.length > 0 ? (
                                        <div className="space-y-4">
                                            {reportCards.map((report) => (
                                                <motion.div key={report._id} className="bg-white rounded-2xl p-5 shadow-soft-md cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedReport(report)} whileHover={{ y: -2 }}>
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                                                            {report.pet?.profileImage ? <Image src={report.pet.profileImage} alt="" width={80} height={80} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary-100">{report.pet?.type === 'cat' ? <Cat className="w-10 h-10 text-primary-600" /> : <Dog className="w-10 h-10 text-primary-600" />}</div>}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div>
                                                                    <h3 className="font-semibold text-neutral-900 text-lg">{report.pet?.name}</h3>
                                                                    <p className="text-sm text-neutral-500">{new Date(report.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                                                </div>
                                                                <MoodBadge mood={report.overallMood} />
                                                            </div>
                                                            {report.messageToParent && <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{report.messageToParent}</p>}
                                                            <div className="flex items-center gap-4 text-sm text-neutral-500">
                                                                {report.media?.length > 0 && <span className="flex items-center gap-1"><Camera className="w-4 h-4" />{report.media.length} photos</span>}
                                                                {report.activities?.length > 0 && <span className="flex items-center gap-1"><Activity className="w-4 h-4" />{report.activities.length} activities</span>}
                                                            </div>
                                                        </div>
                                                        {report.media?.length > 0 && (
                                                            <div className="hidden md:flex gap-2 shrink-0">
                                                                {report.media.slice(0, 2).map((item, idx) => (
                                                                    <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-200 relative">
                                                                        <Image src={item.thumbnailUrl || item.url} alt="" fill className="object-cover" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl p-12 shadow-soft-md text-center">
                                            <FileText className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                                            <h3 className="font-semibold text-neutral-900 mb-2">No report cards yet</h3>
                                            <p className="text-neutral-500 mb-6">Report cards will appear here when your pet is staying with us</p>
                                            <Link href="/#booking" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"><Calendar className="w-5 h-5" />Book a Stay</Link>
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
                                            <div><label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label><input type="text" defaultValue={user.name} onBlur={(e) => handleUpdateProfile({ name: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                                            <div><label className="block text-sm font-medium text-neutral-700 mb-1">Email</label><input type="email" value={user.email} disabled className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-500" /><p className="text-xs text-neutral-400 mt-1">Email cannot be changed</p></div>
                                            <div><label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label><input type="tel" defaultValue={user.phone || ''} onBlur={(e) => handleUpdateProfile({ phone: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="(617) 123-4567" /></div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        <h3 className="font-semibold text-neutral-900 mb-4">Account Details</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between py-2 border-b border-neutral-100"><span className="text-neutral-500">Member Since</span><span className="text-neutral-900">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span></div>
                                            <div className="flex justify-between py-2 border-b border-neutral-100"><span className="text-neutral-500">Loyalty Points</span><span className="text-neutral-900 font-semibold">{user.loyaltyPoints || 0} pts</span></div>
                                            <div className="flex justify-between py-2"><span className="text-neutral-500">Referral Code</span><span className="font-mono text-primary-700">{user.referralCode || 'N/A'}</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 shadow-soft-md">
                                        <h3 className="font-semibold text-neutral-900 mb-4">Contact Support</h3>
                                        <div className="space-y-3">
                                            <a href="tel:+16177628179" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100"><Phone className="w-5 h-5 text-primary-600" /><span className="text-neutral-700">(617) 762-8179</span></a>
                                            <a href="mailto:choi.coco0328@gmail.com" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100"><Mail className="w-5 h-5 text-primary-600" /><span className="text-neutral-700">choi.coco0328@gmail.com</span></a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Report Card Detail Modal */}
            <AnimatePresence>
                {selectedReport && <ReportCardDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />}
            </AnimatePresence>
        </div>
    )
}

// Suspense wrapper for useSearchParams
export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center">
                <div className="animate-spin">
                    <PawPrint className="w-12 h-12 text-primary-700" />
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    )
}