'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageSquare,
    Calendar,
    Info,
    MessageCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import emailjs from '@emailjs/browser'

// Your EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_zutxm39'
const EMAILJS_TEMPLATE_ID = 'template_w1qhbij'
const EMAILJS_PUBLIC_KEY = 'vKzLlTxX7f0V2PJoh'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        petType: 'dog',
        petName: '',
        startDate: '',
        endDate: '',
        message: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    // Initialize EmailJS (do this once when component mounts)
    if (typeof window !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Prepare template parameters
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone || 'Not provided',
                pet_type: formData.petType,
                pet_name: formData.petName || 'Not provided',
                check_in: formData.startDate || 'Not specified',
                check_out: formData.endDate || 'Not specified',
                message: formData.message || 'No additional message',
                reply_to: formData.email
            }

            // Send email using EmailJS
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            )

            if (response.status === 200) {
                toast.success("Thank you for your inquiry! We'll get back to you within 2 hours.", {
                    duration: 5000,
                    style: {
                        background: '#111827',
                        color: '#fff'
                    }
                })

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    petType: 'dog',
                    petName: '',
                    startDate: '',
                    endDate: '',
                    message: ''
                })
            } else {
                throw new Error('Failed to send email')
            }
        } catch (error) {
            console.error('Email send error:', error)
            toast.error("Failed to send your inquiry. Please try again or call us directly at (617) 762-8179", {
                duration: 5000,
                style: {
                    background: '#dc2626',
                    color: '#fff'
                }
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <section id="contact" className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* ===== Title + SVG ===== */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-6 md:mb-12 relative"
                >
                    {/* Mobile SVGs */}
                    <div className="flex items-center justify-center gap-10 mb-3 lg:hidden">
                        <Image
                            src="/svgs/contact-decoration2.svg"
                            alt="Contact decoration left"
                            width={120}
                            height={120}
                            className="w-34 h-34 opacity-80"
                        />
                        <Image
                            src="/svgs/contact-decoration.svg"
                            alt="Contact decoration right"
                            width={120}
                            height={120}
                            className="w-34 h-34 opacity-80"
                        />
                    </div>

                    {/* Desktop SVGs - Keep Original */}
                    <motion.div
                        className="hidden lg:block absolute top-[40%] -translate-y-1/2 left-0"
                        initial={{ opacity: 0, x: -50, y: 100, scale: 0.8 }}
                        whileInView={{
                            opacity: 1,
                            x: -20,
                            scale: 2.5,
                            y: [0, -40, 0]
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
                            src="/svgs/contact-decoration2.svg"
                            alt="Contact decoration left"
                            width={200}
                            height={200}
                            className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 opacity-90"
                        />
                    </motion.div>

                    {/* CENTER TITLE */}
                    <div className="text-center mb-4 md:mb-8">
                        <span className="text-primary-700 font-semibold text-s md:text-sm uppercase tracking-wide">
                            Contact Us
                        </span>
                        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-2 mb-2 md:mb-4 text-neutral-800">
                            Ready to Book <span className="text-gradient">Pet&apos;s Stay?</span>
                        </h2>
                    </div>

                    {/* Desktop Right SVG - Keep Original */}
                    <motion.div
                        className="hidden lg:block absolute top-[36%] -translate-y-1/2 right-0"
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        whileInView={{
                            opacity: 1,
                            x: 20,
                            scale: 2.3,
                            y: [0, -20, 0]
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
                            src="/svgs/contact-decoration.svg"
                            alt="Contact decoration right"
                            width={200}
                            height={200}
                            className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 opacity-90"
                        />
                    </motion.div>

                    {/* DESCRIPTION */}
                    <p className="text-xs sm:text-sm md:text-xl text-neutral-600 max-w-3xl mx-auto text-center">
                        Get in touch today. We respond within 2 hours!
                    </p>
                </motion.div>

                {/* Mobile Layout */}
                <div className="lg:hidden">
                    {/* Mobile Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-6"
                    >
                        <div className="bg-white rounded-2xl shadow-soft-xl border border-neutral-100 p-4">
                            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-neutral-900">
                                <MessageSquare className="text-primary-700 w-4 h-4" />
                                Send Us a Message
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all text-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all text-sm"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all text-sm"
                                                placeholder="(617) 762-8179"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                                                Pet Type *
                                            </label>
                                            <select
                                                name="petType"
                                                value={formData.petType}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all text-sm"
                                            >
                                                <option value="dog">Dog</option>
                                                <option value="cat">Cat</option>
                                                <option value="both">Both</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                                            Pet&apos;s Name
                                        </label>
                                        <input
                                            type="text"
                                            name="petName"
                                            value={formData.petName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all text-sm"
                                            placeholder="Max, Luna, etc."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                                                Check-in Date
                                            </label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-neutral-700 mb-1">
                                                Check-out Date
                                            </label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                                            Message / Special Requirements
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={2}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all resize-none text-sm"
                                            placeholder="Tell us about your pet's needs..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 text-sm ${
                                        isSubmitting
                                            ? 'bg-neutral-400 cursor-not-allowed'
                                            : 'bg-primary-700 active:bg-primary-800'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Mobile Horizontal Scroll Cards - Fixed */}
                    <div className="relative">
                        <div
                            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            <style jsx>{`
                                .flex::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                            {/* Quick Contact Card - Mobile */}
                            <div className="bg-white rounded-2xl shadow-soft-xl border border-neutral-100 p-3.5 flex-shrink-0 snap-center" style={{ width: '220px' }}>
                                <h4 className="text-sm font-bold mb-2.5 text-neutral-900">Quick Contact</h4>
                                <div className="space-y-2">
                                    <a href="tel:617-762-8179" className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-3.5 h-3.5 text-primary-700" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-medium text-neutral-900">Phone</p>
                                            <p className="text-[10px] text-neutral-600">(617) 762-8179</p>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MessageCircle className="w-3.5 h-3.5 text-primary-700" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-medium text-neutral-900">WeChat</p>
                                            <p className="text-[10px] text-neutral-600">Bibi0210-Dudu0830</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-3.5 h-3.5 text-primary-700" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-medium text-neutral-900">Location</p>
                                            <p className="text-[10px] text-neutral-600">Wellesley Hills, MA</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Response Time Card - Mobile */}
                            <div className="bg-gradient-to-br from-primary-700 to-primary-800 text-white rounded-2xl p-3.5 flex-shrink-0 snap-center" style={{ width: '200px' }}>
                                <Calendar className="w-6 h-6 mb-2" />
                                <h4 className="font-bold text-sm mb-1">Quick Response</h4>
                                <p className="text-primary-50 text-[10px]">
                                    We respond to all inquiries within 2 hours!
                                </p>
                            </div>

                            {/* Booking Process Card - Mobile */}
                            <div className="bg-white rounded-2xl shadow-soft-xl border border-neutral-100 p-3.5 flex-shrink-0 snap-center" style={{ width: '240px' }}>
                                <h4 className="font-bold text-sm mb-2.5 flex items-center gap-1.5 text-neutral-900">
                                    <Info className="w-3.5 h-3.5 text-primary-700" />
                                    Booking Process
                                </h4>
                                <ol className="space-y-1.5">
                                    {[
                                        'Submit form',
                                        'Phone consult',
                                        'Meet & greet',
                                        'Confirm & drop off'
                                    ].map((step, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <span className="w-5 h-5 bg-primary-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            <span className="text-[11px] text-neutral-700">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {/* Scroll indicator */}
                        <div className="flex justify-center mt-2">
                            <div className="flex gap-1">
                                <div className="w-6 h-0.5 bg-primary-300 rounded-full"></div>
                                <div className="w-2 h-0.5 bg-neutral-300 rounded-full"></div>
                                <div className="w-2 h-0.5 bg-neutral-300 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - Keep Original */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-8">
                    {/* Contact Form - Desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-3xl shadow-soft-xl border border-neutral-100 p-8">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-neutral-900">
                                <MessageSquare className="text-primary-700 w-6 h-6" />
                                Send Us a Message
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all"
                                            placeholder="(617) 762-8179"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Pet Type *
                                        </label>
                                        <select
                                            name="petType"
                                            value={formData.petType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all"
                                        >
                                            <option value="dog">Dog</option>
                                            <option value="cat">Cat</option>
                                            <option value="both">Both</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Pet&apos;s Name
                                    </label>
                                    <input
                                        type="text"
                                        name="petName"
                                        value={formData.petName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all"
                                        placeholder="Max, Luna, etc."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Check-in Date
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Check-out Date
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Message / Special Requirements
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-700 focus:outline-none transition-all resize-none"
                                        placeholder="Tell us about your pet's needs, medications, preferences, or any questions you have..."
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
                                        isSubmitting
                                            ? 'bg-neutral-400 cursor-not-allowed'
                                            : 'bg-primary-700 hover:bg-primary-800 hover:shadow-soft-xl'
                                    }`}
                                >
                                    <span className="relative z-10">
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 inline mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </span>
                                    {!isSubmitting && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Info Cards - Desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {/* Quick Contact Card - Desktop */}
                        <div className="bg-white rounded-3xl shadow-soft-xl border border-neutral-100 p-6">
                            <h3 className="text-xl font-bold mb-6 text-neutral-900">Quick Contact</h3>
                            <div className="space-y-4">
                                <motion.a
                                    href="tel:617-762-8179"
                                    className="flex items-center gap-3 group cursor-pointer"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-primary-700 group-hover:text-white transition-all">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">Phone</p>
                                        <p className="text-neutral-600">
                                            (617) 762-8179
                                        </p>
                                    </div>
                                </motion.a>

                                <motion.a
                                    href="mailto:choi.coco0328@gmail.com"
                                    className="flex items-center gap-3 group cursor-pointer"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-primary-700 group-hover:text-white transition-all">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">Email</p>
                                        <p className="text-neutral-600 text-sm">
                                            choi.coco0328@gmail.com
                                        </p>
                                    </div>
                                </motion.a>

                                <motion.div
                                    className="flex items-center gap-3 group cursor-pointer"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-primary-700 group-hover:text-white transition-all">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">WeChat</p>
                                        <p className="text-neutral-600 text-sm">
                                            Bibi0210-Dudu0830
                                        </p>
                                    </div>
                                </motion.div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-primary-700" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">Location</p>
                                        <p className="text-neutral-600">
                                            Wellesley Hills, MA
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-primary-700" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">Hours</p>
                                        <p className="text-neutral-600">
                                            Mon-Sun: 7AM - 8PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Response Time Card - Desktop */}
                        <motion.div
                            className="bg-gradient-to-br from-primary-700 to-primary-800 text-white rounded-3xl p-6 relative overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="relative z-10">
                                <Calendar className="w-10 h-10 mb-3" />
                                <h4 className="font-bold text-lg mb-2">Quick Response Guarantee</h4>
                                <p className="text-primary-50 text-sm">
                                    We respond to all inquiries within 2 hours during business hours!
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                        </motion.div>

                        {/* Booking Process Card - Desktop */}
                        <div className="bg-white rounded-3xl shadow-soft-xl border border-neutral-100 p-6">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-neutral-900">
                                <Info className="w-5 h-5 text-primary-700" />
                                Booking Process
                            </h4>
                            <ol className="space-y-3">
                                {[
                                    'Submit inquiry form',
                                    'Phone consultation',
                                    'Meet & greet visit',
                                    'Confirm booking',
                                    'Drop off your pet!'
                                ].map((step, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <motion.span
                                            className="w-8 h-8 bg-primary-700 text-white rounded-full flex items-center justify-center text-sm font-bold"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {index + 1}
                                        </motion.span>
                                        <span className="text-neutral-700">
                                            {step}
                                        </span>
                                    </motion.li>
                                ))}
                            </ol>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}