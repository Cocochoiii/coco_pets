'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Lock, Mail, Phone, ArrowRight, Eye, EyeOff, LogIn, UserPlus,
    Home, Heart, Shield, Calendar, Bell, CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ClientPortalContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/dashboard'

    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [signupData, setSignupData] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: ''
    })

    useEffect(() => {
        setMounted(true)

        // 检查是否从登出来的
        const isFromLogout = sessionStorage.getItem('fromLogout')
        if (isFromLogout) {
            sessionStorage.removeItem('fromLogout')
            return
        }

        // 检查是否已登录
        const user = localStorage.getItem('user')
        if (user) {
            router.replace('/dashboard')
        }
    }, [router])

    const handleLogin = async () => {
        if (!loginData.email || !loginData.password) {
            toast.error('Please fill in all fields')
            return
        }

        setIsLoading(true)

        // 模拟延迟
        await new Promise(r => setTimeout(r, 700))

        // 检查是否是管理员
        const isAdmin = loginData.email.trim().toLowerCase() === 'hcaicoco@gmail.com' && loginData.password === '121212'

        // 创建用户对象
        const userObj = {
            name: isAdmin ? 'Coco' : loginData.email.split('@')[0],
            email: loginData.email.trim().toLowerCase(),
            role: isAdmin ? 'admin' : 'user',
            permissions: isAdmin ? ['edit_pets', 'edit_content', 'view_all'] : ['view_only'],
            loyaltyPoints: Math.floor(Math.random() * 500),
            referralCode: `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            createdAt: new Date().toISOString()
        }

        // 保存到 localStorage
        localStorage.setItem('user', JSON.stringify(userObj))

        // 触发事件通知其他组件
        window.dispatchEvent(new Event('userLogin'))
        window.dispatchEvent(new Event('storage'))

        if (isAdmin) {
            toast.success('Welcome back, Admin Coco!', {
                icon: '👑',
                style: { background: '#111827', color: '#fff' }
            })
        } else {
            toast.success(`Welcome, ${userObj.name}!`, {
                style: { background: '#111827', color: '#fff' }
            })
        }

        setIsLoading(false)

        // 重定向
        if (redirectTo.includes('#booking')) {
            router.replace('/')
            setTimeout(() => {
                const bookingSection = document.getElementById('booking')
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' })
                }
            }, 500)
        } else {
            router.replace(redirectTo)
        }
    }

    const handleSignup = async () => {
        if (!signupData.name || !signupData.email || !signupData.phone || !signupData.password || !signupData.confirmPassword) {
            toast.error('Please fill in all fields')
            return
        }

        if (signupData.password !== signupData.confirmPassword) {
            toast.error('Passwords do not match!')
            return
        }

        if (signupData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)
        await new Promise(r => setTimeout(r, 700))

        // 新注册用户始终是普通用户
        const userObj = {
            name: signupData.name,
            email: signupData.email.trim().toLowerCase(),
            phone: signupData.phone,
            role: 'user',
            permissions: ['view_only'],
            loyaltyPoints: 100, // 新用户送积分
            referralCode: `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            createdAt: new Date().toISOString()
        }

        localStorage.setItem('user', JSON.stringify(userObj))

        // 触发事件
        window.dispatchEvent(new Event('userLogin'))
        window.dispatchEvent(new Event('storage'))

        toast.success('Account created! Welcome to Coco\'s Pet Paradise!', {
            icon: '🎉',
            style: { background: '#111827', color: '#fff' }
        })

        setIsLoading(false)

        if (redirectTo.includes('#booking')) {
            router.replace('/')
            setTimeout(() => {
                const bookingSection = document.getElementById('booking')
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' })
                }
            }, 500)
        } else {
            router.push('/dashboard')
        }
    }

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-primary-700 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50">
            {/* Header */}
            <div className="container mx-auto px-4 py-6">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-700 hover:text-primary-700 transition-colors group">
                    <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Home</span>
                </Link>
            </div>

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    {/* Title */}
                    <div className="text-center mb-8">
                        <motion.h1
                            className="text-3xl font-bold text-neutral-900 mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </motion.h1>
                        <motion.p
                            className="text-neutral-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {isLogin ? 'Sign in to manage your bookings' : 'Join Coco\'s Pet Paradise family'}
                        </motion.p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex mb-6 bg-neutral-100 rounded-xl p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isLogin ? 'bg-white shadow-soft text-primary-700' : 'text-neutral-600 hover:text-neutral-900'}`}
                        >
                            <LogIn className="w-4 h-4" />
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${!isLogin ? 'bg-white shadow-soft text-primary-700' : 'text-neutral-600 hover:text-neutral-900'}`}
                        >
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                        </button>
                    </div>

                    {/* Form Card */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-soft-xl p-6 md:p-8"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AnimatePresence mode="wait">
                            {isLogin ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type="email"
                                                value={loginData.email}
                                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-all"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                className="w-full pl-10 pr-12 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-all"
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-700" />
                                            <span className="text-neutral-600">Remember me</span>
                                        </label>
                                        <button className="text-primary-700 hover:underline">Forgot Password?</button>
                                    </div>

                                    <motion.button
                                        onClick={handleLogin}
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="signup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type="text"
                                                value={signupData.name}
                                                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type="email"
                                                value={signupData.email}
                                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-all"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type="tel"
                                                value={signupData.phone}
                                                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-all"
                                                placeholder="(123) 456-7890"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={signupData.password}
                                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                                className="w-full pl-10 pr-12 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-all"
                                                placeholder="Min. 6 characters"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={signupData.confirmPassword}
                                                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-all"
                                                placeholder="Confirm your password"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-start gap-2 cursor-pointer">
                                        <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-700" />
                                        <span className="text-sm text-neutral-600">
                                            I agree to the <a href="#" className="text-primary-700 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-700 hover:underline">Privacy Policy</a>
                                        </span>
                                    </label>

                                    <motion.button
                                        onClick={handleSignup}
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-neutral-600 mb-6">As a member, you&apos;ll enjoy:</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Calendar className="w-6 h-6 text-primary-700" />
                                </div>
                                <p className="text-xs text-neutral-600">Easy Booking</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Heart className="w-6 h-6 text-primary-700" />
                                </div>
                                <p className="text-xs text-neutral-600">Pet Profiles</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Bell className="w-6 h-6 text-primary-700" />
                                </div>
                                <p className="text-xs text-neutral-600">Real-time Updates</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default function ClientPortalPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-primary-700 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ClientPortalContent />
        </Suspense>
    )
}
