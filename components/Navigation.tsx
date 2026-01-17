'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Menu, X, Heart, ArrowRight, Home, Phone, Calendar, Info, Star, User,
    PawPrint, Volume2, VolumeX, Music, LogOut, ChevronDown, Settings
} from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useMusic } from '@/contexts/MusicContext'

interface UserData {
    name: string
    email: string
    role: 'admin' | 'user'
}

export default function Navigation() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [documentHeight, setDocumentHeight] = useState(1)
    const [isDarkNav, setIsDarkNav] = useState(false)
    const [showVolumeSlider, setShowVolumeSlider] = useState(false)
    const [user, setUser] = useState<UserData | null>(null)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const { isPlaying, volume, togglePlay, setVolume } = useMusic()
    const { scrollY } = useScroll()

    const navBackground = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)'])
    const navShadow = useTransform(scrollY, [0, 100], ['0px 0px 0px rgba(0,0,0,0)', '0px 10px 30px rgba(0,0,0,0.1)'])
    const progressWidth = useTransform(scrollY, [0, documentHeight], ['0%', '100%'])

    // 检查用户登录状态
    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser))
                } catch {
                    setUser(null)
                }
            } else {
                setUser(null)
            }
        }

        checkUser()

        // 监听storage变化
        window.addEventListener('storage', checkUser)
        // 自定义事件用于同页面更新
        window.addEventListener('userLogin', checkUser)
        window.addEventListener('userLogout', checkUser)

        return () => {
            window.removeEventListener('storage', checkUser)
            window.removeEventListener('userLogin', checkUser)
            window.removeEventListener('userLogout', checkUser)
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateDocumentHeight = () => {
                setDocumentHeight(document.documentElement.scrollHeight - window.innerHeight || 1)
            }
            updateDocumentHeight()

            const handleScroll = () => {
                const y = window.scrollY
                setScrolled(y > 20)
                setIsDarkNav(y > 300)
            }

            const handleResize = () => {
                updateDocumentHeight()
                if (window.innerWidth > 768) setIsOpen(false)
            }

            window.addEventListener('scroll', handleScroll)
            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('scroll', handleScroll)
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('user')
        sessionStorage.setItem('fromLogout', 'true')
        setUser(null)
        setShowUserMenu(false)
        window.dispatchEvent(new Event('userLogout'))
        router.push('/')
    }

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '#current-pets', label: 'Our Pets', icon: Heart },
        { href: '#services', label: 'Services', icon: Star },
        { href: '#booking', label: 'Book Now', icon: Calendar },
        { href: '#about', label: 'About', icon: Info },
        { href: '#contact', label: 'Contact', icon: Phone }
    ]

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value))
    }

    return (
        <>
            <motion.nav
                className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${isDarkNav ? 'bg-gradient-to-br from-neutral-900 to-neutral-800' : ''}`}
                style={{ backgroundColor: isDarkNav ? 'transparent' : (navBackground as any), boxShadow: navShadow as any }}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            >
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
                            <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <motion.div animate={{ rotate: scrolled ? 360 : 0 }} transition={{ duration: 0.5 }}>
                                    <PawPrint className={`h-8 w-8 md:h-10 md:w-10 transition-colors ${isDarkNav ? 'text-primary-300 group-hover:text-primary-200' : 'text-primary-700 group-hover:text-primary-800'}`} />
                                </motion.div>
                            </motion.div>
                            <div className="hidden sm:block">
                                <motion.span className={`font-bold text-lg md:text-xl block transition-colors ${isDarkNav ? 'text-white' : 'text-neutral-900'}`}>
                                    Coco&apos;s Pet Paradise
                                </motion.span>
                                <motion.span className={`text-xs hidden md:block transition-colors ${isDarkNav ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                    Premium Pet Boarding
                                </motion.span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-6">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onMouseEnter={() => setHoveredItem(item.label)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className="relative"
                                >
                                    <Link
                                        href={item.href}
                                        className={`relative transition-colors font-medium group flex items-center gap-2 ${isDarkNav ? 'text-neutral-100 hover:text-primary-200' : 'text-neutral-700 hover:text-primary-700'}`}
                                    >
                                        <item.icon className={`w-4 h-4 transition-all ${hoveredItem === item.label ? (isDarkNav ? 'text-primary-300' : 'text-primary-700') : (isDarkNav ? 'text-neutral-300' : 'text-neutral-400')}`} />
                                        <span>{item.label}</span>
                                    </Link>
                                    {hoveredItem === item.label && (
                                        <motion.div
                                            className={`absolute -bottom-2 left-0 right-0 h-0.5 ${isDarkNav ? 'bg-primary-300' : 'bg-primary-700'}`}
                                            layoutId="navbar-indicator"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                        />
                                    )}
                                </motion.div>
                            ))}

                            {/* User Account Section */}
                            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="relative">
                                {user ? (
                                    /* Logged In User */
                                    <div className="relative">
                                        <motion.button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center gap-2 bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                        </motion.button>

                                        <AnimatePresence>
                                            {showUserMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-soft-xl border border-neutral-100 overflow-hidden z-50"
                                                >
                                                    <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                                                        <p className="font-semibold text-neutral-900">{user.name}</p>
                                                        <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                                                        {user.role === 'admin' && (
                                                            <span className="inline-block mt-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Admin</span>
                                                        )}
                                                    </div>
                                                    <div className="py-2">
                                                        <Link
                                                            href="/dashboard"
                                                            onClick={() => setShowUserMenu(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors"
                                                        >
                                                            <User className="w-4 h-4 text-neutral-500" />
                                                            <span className="text-neutral-700">My Dashboard</span>
                                                        </Link>
                                                        <Link
                                                            href="/dashboard#bookings"
                                                            onClick={() => setShowUserMenu(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors"
                                                        >
                                                            <Calendar className="w-4 h-4 text-neutral-500" />
                                                            <span className="text-neutral-700">My Bookings</span>
                                                        </Link>
                                                        <Link
                                                            href="/dashboard#pets"
                                                            onClick={() => setShowUserMenu(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors"
                                                        >
                                                            <Heart className="w-4 h-4 text-neutral-500" />
                                                            <span className="text-neutral-700">My Pets</span>
                                                        </Link>
                                                        <Link
                                                            href="/dashboard#settings"
                                                            onClick={() => setShowUserMenu(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors"
                                                        >
                                                            <Settings className="w-4 h-4 text-neutral-500" />
                                                            <span className="text-neutral-700">Settings</span>
                                                        </Link>
                                                    </div>
                                                    <div className="border-t border-neutral-100 py-2">
                                                        <button
                                                            onClick={handleLogout}
                                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors w-full text-left"
                                                        >
                                                            <LogOut className="w-4 h-4 text-red-500" />
                                                            <span className="text-red-600">Sign Out</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    /* Not Logged In */
                                    <Link
                                        href="/client-portal"
                                        className="relative bg-primary-700 text-white px-5 py-2.5 rounded-lg hover:bg-primary-800 transition-all font-medium shadow-soft hover:shadow-soft-xl flex items-center gap-2 group"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>My Account</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                )}
                            </motion.div>

                            {/* Music Button */}
                            <div className="relative">
                                <motion.button
                                    onClick={togglePlay}
                                    onMouseEnter={() => setShowVolumeSlider(true)}
                                    onMouseLeave={() => setShowVolumeSlider(false)}
                                    className={`relative p-2.5 rounded-lg transition-all ${isPlaying ? 'bg-primary-700 text-white' : isDarkNav ? 'bg-neutral-700 text-neutral-300' : 'bg-neutral-200 text-neutral-600'} hover:scale-110`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                </motion.button>

                                <AnimatePresence>
                                    {showVolumeSlider && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-soft-xl p-3 border border-neutral-200"
                                            onMouseEnter={() => setShowVolumeSlider(true)}
                                            onMouseLeave={() => setShowVolumeSlider(false)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Music className="w-4 h-4 text-neutral-600" />
                                                <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-20 accent-primary-700" />
                                                <span className="text-xs text-neutral-600 w-8">{Math.round(volume * 100)}%</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-2 lg:hidden">
                            {user && (
                                <Link href="/dashboard" className="p-2 bg-primary-700 text-white rounded-lg">
                                    <User className="w-5 h-5" />
                                </Link>
                            )}
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`p-2 md:p-3 rounded-lg transition-colors ${isDarkNav ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isOpen ? (
                                    <X className={`h-6 w-6 ${isDarkNav ? 'text-neutral-100' : 'text-neutral-700'}`} />
                                ) : (
                                    <Menu className={`h-6 w-6 ${isDarkNav ? 'text-neutral-100' : 'text-neutral-700'}`} />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`lg:hidden absolute top-full left-0 right-0 border-t shadow-soft-xl backdrop-blur-md ${isDarkNav ? 'bg-neutral-900/95 border-neutral-700' : 'bg-white/95 border-neutral-200'}`}
                        >
                            <div className="container mx-auto px-4 py-4">
                                {/* User Info in Mobile */}
                                {user && (
                                    <div className={`p-4 mb-4 rounded-xl ${isDarkNav ? 'bg-neutral-800' : 'bg-primary-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-700 text-white rounded-full flex items-center justify-center font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className={`font-semibold ${isDarkNav ? 'text-white' : 'text-neutral-900'}`}>{user.name}</p>
                                                <p className={`text-sm ${isDarkNav ? 'text-neutral-400' : 'text-neutral-500'}`}>{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {navItems.map((item, index) => (
                                    <motion.div key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all font-medium ${isDarkNav ? 'text-neutral-100 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-primary-50'}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <item.icon className={`w-5 h-5 ${isDarkNav ? 'text-neutral-300' : 'text-neutral-400'}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile Auth Buttons */}
                                <div className="mt-4 space-y-2">
                                    {user ? (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                className="block bg-primary-700 text-white text-center py-3 rounded-lg font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                My Dashboard
                                            </Link>
                                            <button
                                                onClick={() => { handleLogout(); setIsOpen(false); }}
                                                className="block w-full bg-neutral-200 text-neutral-700 text-center py-3 rounded-lg font-medium"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/client-portal"
                                            className="block bg-primary-700 text-white text-center py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <User className="w-5 h-5" />
                                            Sign In / Register
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Click outside to close user menu */}
            {showUserMenu && (
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
            )}

            {/* Progress Bar */}
            <motion.div className="fixed top-16 md:top-20 left-0 right-0 h-0.5 bg-neutral-200 z-40" style={{ opacity: scrolled ? 1 : 0 }}>
                <motion.div className="h-full bg-gradient-to-r from-primary-600 to-primary-700" style={{ width: progressWidth }} />
            </motion.div>
        </>
    )
}
