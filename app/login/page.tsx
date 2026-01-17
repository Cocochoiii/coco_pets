'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, PawPrint, Sparkles } from 'lucide-react'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect') || '/portal'

    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            })

            const data = await res.json()

            if (data.success) {
                router.push(redirect)
            } else {
                setError(data.error || 'Login failed')
            }
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-soft-lg group-hover:scale-110 transition-transform">
                        <PawPrint className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                        Coco&apos;s Pet Paradise
                    </span>
                </Link>
            </div>

            {/* Login Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-soft-2xl p-8 border border-white/50">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome Back</h1>
                    <p className="text-neutral-600">Sign in to manage your pet&apos;s stay</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50"
                                placeholder="Enter your password"
                                required
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
                            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                            <span className="text-neutral-600">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-primary-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-soft-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-neutral-600">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-primary-600 font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Back to home */}
            <div className="text-center mt-6">
                <Link href="/" className="text-neutral-500 hover:text-primary-600 transition-colors">
                    ← Back to home
                </Link>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-300 via-white to-primary-200/30 flex items-center justify-center p-4">
            {/* Decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/30 rounded-full blur-2xl" />
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-300/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-5 w-16 h-16 bg-primary-100/40 rounded-full blur-xl" />
                <div className="absolute top-1/3 right-5 w-24 h-24 bg-primary-200/20 rounded-full blur-2xl" />
            </div>

            <Suspense fallback={
                <div className="w-full max-w-md text-center">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    )
}
