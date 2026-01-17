'use client'

import Link from 'next/link'
import {
    Heart,
    Facebook,
    Instagram,
    Mail,
    Phone,
    MapPin,
    Clock,
    ArrowRight,
    Star,
    MessageCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Footer() {
    const [email, setEmail] = useState('')
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            setIsSubscribed(true)
            setTimeout(() => {
                setIsSubscribed(false)
                setEmail('')
            }, 3000)
        }
    }

    return (
        <footer className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white py-8 md:py-10 lg:py-16 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.02]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Heart className="h-7 w-7 md:h-8 md:w-8 text-primary-500" />
                            </motion.div>
                            <span className="text-lg md:text-xl font-bold">
                                Coco&apos;s Pet Paradise
                            </span>
                        </div>
                        <p className="text-neutral-400 mb-4 text-sm md:text-base max-w-xs">
                            Your pet&apos;s home away from home in Wellesley Hills, MA
                        </p>
                        <div className="flex gap-3 md:gap-4">
                            <motion.a
                                href="#"
                                className="text-neutral-400 hover:text-white transition-colors"
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Facebook className="h-5 w-5 md:h-6 md:w-6" />
                            </motion.a>
                            <motion.a
                                href="#"
                                className="text-neutral-400 hover:text-white transition-colors"
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Instagram className="h-5 w-5 md:h-6 md:w-6" />
                            </motion.a>
                            <motion.a
                                href="mailto:choi.coco0328@gmail.com"
                                className="text-neutral-400 hover:text-white transition-colors"
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Mail className="h-5 w-5 md:h-6 md:w-6" />
                            </motion.a>
                            {/* WeChat Icon with cream-pink hover */}
                            <motion.div
                                className="text-neutral-400 hover:text-primary-400 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                                title="WeChat: Bibi0210-Dudu0830"
                            >
                                <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="font-semibold mb-3 md:mb-4 text-white text-base md:text-lg">
                            Quick Links
                        </h4>
                        <ul className="space-y-1.5 md:space-y-2 text-neutral-400 text-sm md:text-base">
                            {[
                                { href: '#services', label: 'Services' },
                                { href: '#current-pets', label: 'Our Pets' },
                                { href: '#booking', label: 'Book Now' },
                                { href: '#about', label: 'About Us' },
                                { href: '#testimonials', label: 'Testimonials' }
                            ].map(link => (
                                <motion.li key={link.href} whileHover={{ x: 5 }}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-white transition-colors inline-flex items-center gap-1 group"
                                    >
                                        <span>{link.label}</span>
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="font-semibold mb-3 md:mb-4 text-white text-base md:text-lg">
                            Contact Info
                        </h4>
                        <ul className="space-y-2.5 md:space-y-3 text-neutral-400 text-sm md:text-base">
                            <motion.li
                                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                                whileHover={{ x: 5 }}
                            >
                                <Phone className="h-4 w-4 text-primary-500" />
                                <span>(617) 762-8179</span>
                            </motion.li>
                            <motion.li
                                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                                whileHover={{ x: 5 }}
                            >
                                <Mail className="h-4 w-4 text-primary-500" />
                                <span>choi.coco0328@gmail.com</span>
                            </motion.li>
                            {/* WeChat with cream-pink icon */}
                            <motion.li
                                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                                whileHover={{ x: 5 }}
                            >
                                <MessageCircle className="h-4 w-4 text-primary-500" />
                                <span>WeChat: Bibi0210-Dudu0830</span>
                            </motion.li>
                            <motion.li
                                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                                whileHover={{ x: 5 }}
                            >
                                <MapPin className="h-4 w-4 text-primary-500" />
                                <span>Wellesley Hills, MA 02481</span>
                            </motion.li>
                            <motion.li
                                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                                whileHover={{ x: 5 }}
                            >
                                <Clock className="h-4 w-4 text-primary-500" />
                                <span>Mon-Sun: 7:00 AM - 8:00 PM</span>
                            </motion.li>
                        </ul>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="font-semibold mb-3 md:mb-4 text-white text-base md:text-lg">
                            Stay Updated
                        </h4>
                        <p className="text-neutral-400 mb-3 md:mb-4 text-sm md:text-base">
                            Get pet care tips and special offers!
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Your email"
                                    className="w-full px-4 py-2 bg-neutral-700 border-2 border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 transition-all text-sm md:text-base"
                                />
                                {isSubscribed && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    >
                                        <div className="bg-primary-700 rounded-full p-1">
                                            ✓
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            <motion.button
                                type="submit"
                                className="w-full bg-primary-700 text-white py-2.5 md:py-2.5 rounded-lg hover:bg-primary-600 transition-all font-medium relative overflow-hidden group text-sm md:text-base"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10">
                                    {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </motion.button>
                        </form>
                        <p className="text-[11px] md:text-xs text-neutral-500 mt-3">
                            Licensed &amp; Insured | Pet First Aid Certified
                        </p>
                        {/* Trust badges */}
                        <div className="flex items-center gap-1.5 md:gap-2 mt-3">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Star className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary-600 text-primary-600" />
                                </motion.div>
                            ))}
                            <span className="text-[11px] md:text-xs text-neutral-400 ml-1">
                                5.0 Rating
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    className="border-t border-neutral-700 mt-8 pt-6 md:pt-8 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-neutral-400 text-xs md:text-sm">
                        &copy; 2024 Coco&apos;s Pet Paradise. All rights reserved. Made with{' '}
                        <motion.span
                            className="inline-block align-middle"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Heart className="inline h-3.5 w-3.5 md:h-4 md:w-4 text-primary-500 mx-0.5" />
                        </motion.span>
                        {' '}for pets
                    </p>
                </motion.div>
            </div>
        </footer>
    )
}
