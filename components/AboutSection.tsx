'use client'

import { motion } from 'framer-motion'
import { Award, Users, Heart, Shield, Clock, Star, CheckCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function AboutSection() {
    const [showMore, setShowMore] = useState(false)
    const [showAllFeatures, setShowAllFeatures] = useState(false)

    const stats = [
        { icon: Users, value: '500+', label: 'Happy Pets' },
        { icon: Clock, value: '5 Years', label: 'Experience' },
        { icon: Award, value: '100%', label: 'Satisfaction' },
        { icon: Shield, value: 'Certified', label: 'Pet Aid' }
    ]

    const features = [
        '24/7 supervision in a real home environment',
        'Daily photo and video updates for peace of mind',
        'Separate comfortable spaces for cats and dogs',
        'Experienced with special needs and senior pets',
        'Licensed, insured, and pet first aid certified',
        'Personalized care plans for each pet',
        'Indoor and outdoor play areas',
        'Regular grooming and health checks'
    ]

    return (
        <section id="about" className="py-12 md:py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Mobile Streamlined Layout */}
                <div className="lg:hidden">
                    {/* Title Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <span className="text-primary-700 font-semibold text-sm uppercase tracking-wide">
                            About Us
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-4 text-neutral-800">
                            Hi! <span className="text-gradient">Coco&apos;s Pet Paradise</span> here
                        </h2>

                        {/* Intro Text */}
                        <p className="text-sm text-neutral-600 max-w-md mx-auto mb-3">
                            Family-run pet boarding in Wellesley Hills with over 5 years of professional experience,
                            providing a safe, comfortable home environment for your furry family members.
                        </p>

                        {/* Show More Content */}
                        <motion.div
                            initial={false}
                            animate={{ height: showMore ? 'auto' : 0 }}
                            style={{ overflow: 'hidden' }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-sm text-neutral-600 max-w-md mx-auto mb-3">
                                Our home-style approach means your pet isn&apos;t just another guest – they become
                                part of our family during their stay. We maintain a limited number of boarders
                                to ensure each pet receives individual attention and personalized care.
                            </p>
                            <p className="text-sm text-neutral-600 max-w-md mx-auto">
                                Your pet&apos;s comfort, safety, and happiness are our absolute top priorities.
                                We understand the unique personality and needs of each pet.
                            </p>
                        </motion.div>

                        {/* Show More Button */}
                        <button
                            onClick={() => setShowMore(!showMore)}
                            className="mt-3 text-primary-700 font-medium text-sm flex items-center gap-1 mx-auto hover:text-primary-800 transition-colors"
                        >
                            {showMore ? 'Show less' : 'Read more'}
                            {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </motion.div>



                    {/* Stats - Minimal Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="text-center"
                            >
                                <stat.icon className="h-5 w-5 text-primary-700 mx-auto mb-1" />
                                <div className="text-base font-bold text-neutral-900">{stat.value}</div>
                                <div className="text-[10px] text-neutral-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features - Clean List */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <h3 className="text-base font-bold mb-4 text-neutral-900 text-center">
                            Why Choose Us?
                        </h3>
                        <ul className="space-y-2.5">
                            {features.slice(0, showAllFeatures ? features.length : 3).map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="flex items-start gap-2"
                                >
                                    <CheckCircle className="w-4 h-4 text-primary-700 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-neutral-700">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowAllFeatures(!showAllFeatures)}
                            className="mt-3 text-primary-700 font-medium text-sm flex items-center gap-1 hover:text-primary-800 transition-colors"
                        >
                            {showAllFeatures ? 'Show less' : `Show ${features.length - 3} more`}
                            {showAllFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </motion.div>

                    {/* Owner Info - Simplified */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-white rounded-2xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-700 to-primary-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-soft">
                                CC
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-neutral-900">Coco Choi</h4>
                                <p className="text-xs text-neutral-600">Owner & Lead Caretaker</p>
                                <div className="flex items-center gap-0.5 mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-primary-700 text-primary-700" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 bg-primary-700 text-white text-sm font-medium rounded-full hover:bg-primary-800 transition-colors"
                        >
                            Book Now
                        </motion.button>
                    </motion.div>
                </div>

                {/* Desktop Layout - Cleaner Version */}
                <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-xl mx-auto lg:max-w-none"
                    >
                        <div className="mb-6 text-center lg:text-left">
                            <span className="text-primary-700 font-semibold text-sm uppercase tracking-wide">
                                About Us
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-2 mb-6 text-neutral-900">
                                Welcome to <span className="text-gradient">Coco&apos;s Pet Paradise</span>
                            </h2>
                        </div>

                        <p className="text-neutral-600 mb-4 text-base md:text-lg leading-relaxed text-center lg:text-left">
                            Welcome to our family-run pet boarding service in beautiful Wellesley Hills!
                            With a genuine love for animals and over 5 years of professional experience,
                            we provide a safe, comfortable, and fun environment for your furry family members.
                        </p>

                        <p className="text-neutral-600 mb-4 text-base md:text-lg leading-relaxed text-center lg:text-left">
                            Our home-style approach means your pet isn&apos;t just another guest – they become
                            part of our family during their stay. We maintain a limited number of boarders
                            to ensure each pet receives individual attention and personalized care.
                        </p>

                        <p className="text-neutral-600 mb-8 text-base md:text-lg leading-relaxed text-center lg:text-left">
                            Have cared for{' '}
                            <span className="font-bold text-primary-700 border-b-2 border-primary-200">
                                16 wonderful cats
                            </span>{' '}
                            and{' '}
                            <span className="font-bold text-primary-700 border-b-2 border-primary-200">
                                15 amazing dogs
                            </span>
                            , we understand the unique personality and needs of each pet. Your pet&apos;s comfort,
                            safety, and happiness are our absolute top priorities.
                        </p>

                        {/* Stats - Clean Display */}
                        <div className="flex justify-around lg:justify-start lg:gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center lg:text-left"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <stat.icon className="h-5 w-5 text-primary-700" />
                                        <div className="text-2xl font-bold text-neutral-900">
                                            {stat.value}
                                        </div>
                                    </div>
                                    <div className="text-sm text-neutral-600 ml-7">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Content - Simplified */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-xl mx-auto lg:max-w-none"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
                                <Star className="h-6 w-6 text-primary-700 fill-primary-700" />
                                <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
                                    Why Choose Us?
                                </h3>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-3 group cursor-pointer"
                                        whileHover={{ x: 5 }}
                                    >
                                        <CheckCircle className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base text-neutral-700 group-hover:text-neutral-900 transition-colors">
                                            {feature}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Owner Info - Integrated */}
                            <motion.div
                                className="flex items-center justify-between p-5 bg-gradient-to-r from-neutral-50 to-white rounded-2xl mb-6"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary-700 to-primary-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-soft-lg">
                                        CC
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-neutral-900">
                                            Coco Choi
                                        </h4>
                                        <p className="text-neutral-600 text-sm">
                                            Owner &amp; Lead Caretaker
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-primary-700 text-primary-700" />
                                            ))}
                                            <span className="text-sm text-neutral-500 ml-1">
                                                5.0 rating
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* CTA Button */}
                            <motion.button
                                className="w-full btn-primary py-3 rounded-full font-semibold group text-base"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Learn More About Us
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}