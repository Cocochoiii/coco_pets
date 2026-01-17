'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Calendar, Phone, Mail, HelpCircle } from 'lucide-react'

export default function BookingCancelPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-300 via-white to-primary-200/30 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                {/* Cancel Card */}
                <div className="bg-white rounded-3xl shadow-soft-2xl p-8 text-center">
                    {/* Warning Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-warning/10 rounded-full mx-auto mb-6 flex items-center justify-center"
                    >
                        <AlertCircle className="w-14 h-14 text-warning" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-neutral-900 mb-2"
                    >
                        Booking Cancelled
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-neutral-600 mb-8"
                    >
                        Your booking was not completed. No charges have been made to your account.
                    </motion.p>

                    {/* Help Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-neutral-50 rounded-2xl p-6 mb-8 text-left"
                    >
                        <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-primary-600" />
                            Need Help?
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4">
                            If you experienced any issues during checkout or have questions about our services, 
                            please don&apos;t hesitate to contact us.
                        </p>
                        <div className="space-y-3">
                            <a 
                                href="tel:+16177628179" 
                                className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-primary-50 transition-all"
                            >
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-primary-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900 text-sm">(617) 762-8179</p>
                                    <p className="text-xs text-neutral-500">Available 9 AM - 6 PM</p>
                                </div>
                            </a>
                            <a 
                                href="mailto:choi.coco0328@gmail.com" 
                                className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-primary-50 transition-all"
                            >
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-primary-700" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900 text-sm">choi.coco0328@gmail.com</p>
                                    <p className="text-xs text-neutral-500">We reply within 24 hours</p>
                                </div>
                            </a>
                        </div>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Link
                            href="/#booking"
                            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-soft-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-5 h-5" />
                            Try Again
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 bg-neutral-100 text-neutral-700 py-3 px-6 rounded-xl font-semibold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
