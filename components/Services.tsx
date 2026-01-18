'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
    Home,
    Heart,
    Camera,
    Car,
    Bath,
    Pill,
    Play,
    Moon,
    Shield,
    Award,
    Star,
    ArrowRight,
    Sparkles
} from 'lucide-react'
import { useState } from 'react'

interface Service {
    icon: any
    title: string
    description: string
    price: string | JSX.Element
    features: string[]
    popular?: boolean
    isFlippable?: boolean
}

export default function Services() {
    const [hoveredService, setHoveredService] = useState<number | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'essential' | 'addon'>('all')
    const [isFlipped, setIsFlipped] = useState(false)

    const services: Service[] = [
        {
            icon: Home,
            title: 'Home Boarding',
            description: 'Your pet stays in our cozy home environment with 24/7 supervision and care',
            price: (
                <div>
                    <div>Cat: $25 | Dog: $40-60</div>
                    <div>Dog Daycare: $25-30</div>
                </div>
            ),
            features: [
                'Comfortable home environment',
                '24/7 supervision',
                'Separate spaces for cats and dogs',
                'Daily exercise and playtime'
            ],
            popular: true,
            isFlippable: true
        },
        {
            icon: Heart,
            title: 'Personalized Care',
            description: "Customized care plans tailored to your pet's unique needs and preferences",
            price: 'Included with boarding',
            features: [
                'Custom feeding schedules',
                'Special diet accommodation',
                'Individual attention',
                'Behavioral support',
                'Senior pet care'
            ]
        },
        {
            icon: Camera,
            title: 'Daily Updates',
            description: 'Stay connected with photos and videos of your pet throughout the day',
            price: 'Included with boarding',
            features: [
                'Morning & evening photos',
                'Video updates',
                'Activity reports',
                'Real-time messaging',
                'Emergency notifications'
            ],
            popular: true
        },
        {
            icon: Car,
            title: 'Pick-up & Drop-off',
            description: "Convenient transportation service for your pet's comfort",
            price: 'Free (within 10 miles) | From $20',
            features: [
                'Safe, comfortable vehicles',
                'Secured pet carriers',
                'Flexible scheduling',
                'Door-to-door service',
                'GPS tracking available'
            ]
        },
        {
            icon: Bath,
            title: 'Grooming Services',
            description: 'Keep your pet clean and comfortable during their stay',
            price: 'From $15/session',
            features: [
                'Brushing and combing',
                'Nail trimming',
                'Ear cleaning',
                'Teeth cleaning',
                'Bath (if needed)'
            ]
        },
        {
            icon: Pill,
            title: 'Medical Care',
            description: 'Professional medication administration and health monitoring',
            price: 'Included with boarding',
            features: [
                'Medication administration',
                'Health monitoring',
                'Vet coordination',
                'Special needs care',
                'Emergency protocols'
            ]
        },
        {
            icon: Play,
            title: 'Activities & Enrichment',
            description: 'Fun activities to keep your pet engaged and happy',
            price: 'Included with boarding',
            features: [
                'Interactive play sessions',
                'Puzzle toys',
                'Socialization time',
                'Indoor/outdoor play',
                'Training reinforcement'
            ]
        },
        {
            icon: Moon,
            title: 'Overnight Care',
            description: 'Round-the-clock supervision for pets needing extra attention',
            price: 'Included with boarding',
            features: [
                'Nighttime monitoring',
                'Comfort checks',
                'Anxiety support',
                'Emergency response',
                'Bedtime routines'
            ]
        }
    ]

    const filteredServices =
        selectedCategory === 'all'
            ? services
            : selectedCategory === 'essential'
                ? services.slice(0, 6)
                : services.slice(6)

    return (
        <section id="services" className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white to-neutral-50">
            <div className="container mx-auto px-4">
                {/* ===== Title + SVG ===== */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-10 md:mb-12 relative"
                >
                    {/* Mobile SVGs */}
                    <div className="flex items-center justify-center gap-10 mb-4 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src="/svgs/services-decoration2.svg"
                                alt="Services decoration left"
                                width={100}
                                height={100}
                                className="w-25 h-25 opacity-90"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1.2 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Image
                                src="/svgs/services-decoration.svg"
                                alt="Services decoration right"
                                width={100}
                                height={100}
                                className="w-25 h-25 opacity-90"
                            />
                        </motion.div>
                    </div>

                    {/* Desktop SVGs */}
                    <motion.div
                        className="hidden lg:block absolute top-4 left-0"
                        initial={{ opacity: 0, x: -50, scale: 0.8 }}
                        whileInView={{
                            opacity: 1,
                            x: -30,
                            scale: 1.6,
                            y: [0, 10, 0]
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                        }}
                    >
                        <Image
                            src="/svgs/services-decoration2.svg"
                            alt="Services decoration left"
                            width={200}
                            height={200}
                            className="w-36 h-36 lg:w-48 lg:h-48 xl:w-56 xl:h-56 opacity-90"
                        />
                    </motion.div>

                    <motion.div
                        className="hidden lg:block absolute top-4 right-0"
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        whileInView={{
                            opacity: 1,
                            x: 30,
                            scale: 1.6,
                            y: [0, 10, 0]
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                        }}
                    >
                        <Image
                            src="/svgs/services-decoration.svg"
                            alt="Services decoration right"
                            width={200}
                            height={200}
                            className="w-36 h-36 lg:w-48 lg:h-48 xl:w-56 xl:h-56 opacity-90"
                        />
                    </motion.div>

                    {/* Center Title */}
                    <div className="text-center mb-6 md:mb-8">
                        <span className="text-primary-700 font-semibold text-sm uppercase tracking-wide">
                            Our Services
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-2 mb-3 md:mb-4 text-neutral-800">
                            Comprehensive <span className="text-gradient">Pet Care</span>
                        </h2>
                    </div>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto text-center">
                        Everything your pet needs for a comfortable and happy stay.
                    </p>
                </motion.div>

                {/* Category Pills */}
                <div className="flex justify-center gap-3 sm:gap-4 mb-8 md:mb-12 flex-wrap">
                    {[
                        { value: 'all', label: 'All Services' },
                        { value: 'essential', label: 'Essential' },
                        { value: 'addon', label: 'Add-ons' }
                    ].map(cat => (
                        <motion.button
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value as any)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-all relative overflow-hidden text-sm sm:text-base ${
                                selectedCategory === cat.value
                                    ? 'bg-neutral-900 text-white shadow-soft-lg'
                                    : 'bg-white text-neutral-700 shadow-soft border border-neutral-200 hover:border-neutral-400'
                            }`}
                        >
                            <span className="relative z-10">{cat.label}</span>
                            {selectedCategory === cat.value && (
                                <motion.div
                                    className="absolute inset-0 bg-primary-700"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ zIndex: 1 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Services Grid - Mobile Horizontal Scroll */}
                <div className="sm:hidden">
                    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                            {filteredServices.map((service, index) => (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08 }}
                                    className="relative group flex-shrink-0"
                                    style={{ width: '280px', height: service.isFlippable ? '450px' : 'auto', perspective: '1000px' }}
                                >
                                    {service.isFlippable ? (
                                        // Flippable Home Boarding Card for Mobile
                                        <motion.div
                                            className="relative w-full h-full preserve-3d cursor-pointer"
                                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                                            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                                            onClick={() => setIsFlipped(!isFlipped)}
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            {/* Front */}
                                            <div className="absolute inset-0 backface-hidden">
                                                <div className="bg-white rounded-2xl shadow-soft p-5 h-full border-2 border-transparent hover:border-primary-700 transition-all">
                                                    {service.popular && (
                                                        <div className="flex justify-end mb-2">
                                                            <div className="bg-neutral-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1">
                                                                <Star className="w-3 h-3 fill-white" />
                                                                Popular
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-neutral-100">
                                                        <service.icon className="w-7 h-7 text-neutral-700" />
                                                    </div>
                                                    <h3 className="text-lg font-bold mb-2 text-neutral-900">{service.title}</h3>
                                                    <p className="text-sm text-neutral-600 mb-3">{service.description}</p>
                                                    <div className="mb-3 p-2.5 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-lg border border-primary-100">
                                                        <p className="text-xs text-primary-700 font-semibold">{service.price}</p>
                                                    </div>
                                                    <div className="text-xs text-primary-600 text-center">Tap to see details</div>
                                                </div>
                                            </div>

                                            {/* Back - Pricing Details */}
                                            <div className="absolute inset-0 backface-hidden rotate-y-180">
                                                <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-soft-xl p-4 h-full flex flex-col">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h3 className="text-base font-bold text-neutral-900">Detailed Pricing</h3>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsFlipped(false);
                                                            }}
                                                            className="text-primary-600 text-xs hover:text-primary-700 font-medium"
                                                        >
                                                            ← Back
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2.5 text-xs overflow-y-auto flex-grow">
                                                        {/* Cat Pricing */}
                                                        <div className="bg-white/80 rounded-lg p-2">
                                                            <h4 className="font-semibold text-primary-700 mb-1 flex items-center gap-1">
                                                                Cat Boarding
                                                            </h4>
                                                            <div className="space-y-0.5 text-neutral-700">
                                                                <div className="flex justify-between">
                                                                    <span>1 Cat</span>
                                                                    <span className="font-medium">$25/night</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>2 Cats</span>
                                                                    <span className="font-medium">$40/night</span>
                                                                </div>
                                                                <div className="pt-1 mt-1 border-t border-neutral-200">
                                                                    <div className="font-medium text-primary-600 mb-0.5">Monthly Packages:</div>
                                                                    <div className="flex justify-between">
                                                                        <span>30 Days</span>
                                                                        <span className="font-medium">$700</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span>60 Days</span>
                                                                        <span className="font-medium">$1,400</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Dog Pricing */}
                                                        <div className="bg-white/80 rounded-lg p-2">
                                                            <h4 className="font-semibold text-primary-700 mb-1 flex items-center gap-1">
                                                                Dog Boarding
                                                            </h4>
                                                            <div className="space-y-0.5 text-neutral-700">
                                                                <div className="flex justify-between">
                                                                    <span>Small (&lt;30 lbs)</span>
                                                                    <span className="font-medium">$40/night</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Large (&gt;30 lbs)</span>
                                                                    <span className="font-medium">$60/night</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>2 Small Dogs</span>
                                                                    <span className="font-medium">$70/night</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>2 Large Dogs</span>
                                                                    <span className="font-medium">$110/night</span>
                                                                </div>
                                                                <div className="pt-1 mt-1 border-t border-neutral-200">
                                                                    <div className="font-medium text-primary-600 mb-0.5">30-Day Package:</div>
                                                                    <div className="flex justify-between">
                                                                        <span>Small Dog</span>
                                                                        <span className="font-medium">$1,000</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span>Large Dog</span>
                                                                        <span className="font-medium">$1,500</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Daycare */}
                                                        <div className="bg-white/80 rounded-lg p-2">
                                                            <h4 className="font-semibold text-primary-700 mb-1 flex items-center gap-1">
                                                                Dog Daycare (10 Hours)
                                                            </h4>
                                                            <div className="space-y-0.5 text-neutral-700">
                                                                <div className="flex justify-between">
                                                                    <span>Small Dog</span>
                                                                    <span className="font-medium">$25/day</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Large Dog</span>
                                                                    <span className="font-medium">$30/day</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        // Regular cards for other services (mobile)
                                        <motion.div
                                            className={`bg-white rounded-2xl shadow-soft p-5 h-full transition-all duration-500 border-2 ${
                                                hoveredService === index
                                                    ? 'border-primary-700 shadow-soft-xl'
                                                    : 'border-transparent'
                                            }`}
                                            whileTap={{ scale: 0.98 }}
                                            onMouseEnter={() => setHoveredService(index)}
                                            onMouseLeave={() => setHoveredService(null)}
                                        >
                                            {service.popular && (
                                                <div className="flex justify-end mb-2">
                                                    <motion.div
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ delay: 0.4 + index * 0.05, type: 'spring' }}
                                                        className="bg-neutral-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-soft-lg"
                                                    >
                                                        <Star className="w-3 h-3 fill-white" />
                                                        Popular
                                                    </motion.div>
                                                </div>
                                            )}

                                            <motion.div
                                                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ${
                                                    hoveredService === index
                                                        ? 'bg-primary-700 text-white shadow-soft-lg'
                                                        : 'bg-neutral-100 text-neutral-700'
                                                }`}
                                            >
                                                <service.icon className="w-7 h-7" />
                                            </motion.div>

                                            <h3 className="text-lg font-bold mb-2 text-neutral-900">
                                                {service.title}
                                            </h3>
                                            <p className="text-sm text-neutral-600 mb-3">
                                                {service.description}
                                            </p>

                                            {service.price !== 'Included with boarding' && (
                                                <div className="mb-3 p-2.5 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-lg border border-primary-100">
                                                    <p className="text-xs text-primary-700 font-semibold">
                                                        {service.price}
                                                    </p>
                                                </div>
                                            )}

                                            <ul className="space-y-1.5">
                                                {service.features.slice(0, 6).map((feature, idx) => (
                                                    <motion.li
                                                        key={idx}
                                                        className="flex items-start gap-2"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.03 }}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-[2px] transition-all ${
                                                                hoveredService === index
                                                                    ? 'bg-primary-700'
                                                                    : 'bg-neutral-200'
                                                            }`}
                                                        >
                                                            <motion.div
                                                                className="w-1.5 h-1.5 bg-white rounded-full"
                                                                initial={{ scale: 0 }}
                                                                animate={
                                                                    hoveredService === index
                                                                        ? { scale: 1 }
                                                                        : { scale: 0.6 }
                                                                }
                                                            />
                                                        </div>
                                                        <span className="text-xs text-neutral-700">
                                                            {feature}
                                                        </span>
                                                    </motion.li>
                                                ))}

                                            </ul>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="flex justify-center mt-2">
                        <div className="flex gap-1">
                            {[0, 1, 2].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-0.5 rounded-full transition-all ${
                                        i === 0 ? 'w-6 bg-primary-300' : 'w-2 bg-neutral-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop/Tablet Grid */}
                <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredServices.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className="relative group"
                            style={service.isFlippable ? { perspective: '1000px' } : {}}
                        >
                            {service.isFlippable ? (
                                // Flippable Home Boarding Card for Desktop
                                <motion.div
                                    className="relative h-[450px] preserve-3d cursor-pointer"
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    style={{ transformStyle: 'preserve-3d' }}
                                    onMouseEnter={() => setHoveredService(index)}
                                    onMouseLeave={() => setHoveredService(null)}
                                    whileHover={{ y: -5 }}
                                >
                                    {/* Front */}
                                    <div className="absolute inset-0 backface-hidden">
                                        <div className={`bg-white rounded-2xl shadow-soft p-6 h-full transition-all duration-500 border-2 ${
                                            hoveredService === index
                                                ? 'border-primary-700 shadow-soft-xl'
                                                : 'border-transparent'
                                        }`}>
                                            {service.popular && (
                                                <div className="absolute -top-3 -right-3 z-10">
                                                    <div className="bg-neutral-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-white" />
                                                        Popular
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mb-4">
                                                <motion.div
                                                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                                                        hoveredService === index
                                                            ? 'bg-primary-700 text-white shadow-soft-lg'
                                                            : 'bg-neutral-100 text-neutral-700'
                                                    }`}
                                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                                >
                                                    <service.icon className="w-7 h-7" />
                                                </motion.div>
                                                <motion.div
                                                    className="text-xs text-primary-600 font-medium px-3 py-1 bg-primary-50 rounded-full"
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    Click to flip
                                                </motion.div>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 text-neutral-900">{service.title}</h3>
                                            <p className="text-sm text-neutral-600 mb-4">{service.description}</p>
                                            <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-lg border border-primary-100">
                                                <p className="text-sm text-primary-700 font-semibold">{service.price}</p>
                                            </div>
                                            <ul className="space-y-2">
                                                {service.features.map((feature, idx) => (
                                                    <motion.li
                                                        key={idx}
                                                        className="flex items-start gap-2"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.03 }}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-[2px] transition-all ${
                                                            hoveredService === index
                                                                ? 'bg-primary-700'
                                                                : 'bg-neutral-200'
                                                        }`}>
                                                            <motion.div
                                                                className="w-2 h-2 bg-white rounded-full"
                                                                initial={{ scale: 0 }}
                                                                animate={
                                                                    hoveredService === index
                                                                        ? { scale: 1 }
                                                                        : { scale: 0.6 }
                                                                }
                                                            />
                                                        </div>
                                                        <span className="text-sm text-neutral-700">{feature}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Back - Detailed Pricing */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                                        <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-soft-xl p-5 h-full flex flex-col">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-bold text-neutral-900">Detailed Pricing</h3>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsFlipped(false);
                                                    }}
                                                    className="text-primary-600 text-sm hover:text-primary-700 font-medium"
                                                >
                                                    ← Back
                                                </button>
                                            </div>

                                            <div className="space-y-3 text-sm overflow-y-auto flex-grow">
                                                {/* Cat Pricing */}
                                                <div className="bg-white/80 rounded-lg p-2.5">
                                                    <h4 className="font-semibold text-primary-700 mb-1.5 flex items-center gap-1">
                                                        Cat Boarding
                                                    </h4>
                                                    <div className="space-y-1 text-neutral-700">
                                                        <div className="flex justify-between">
                                                            <span>1 Cat</span>
                                                            <span className="font-medium">$25/night</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>2 Cats</span>
                                                            <span className="font-medium">$40/night</span>
                                                        </div>
                                                        <div className="pt-1.5 mt-1.5 border-t border-neutral-200">
                                                            <div className="font-medium text-primary-600 mb-0.5">Monthly Packages:</div>
                                                            <div className="flex justify-between">
                                                                <span>30 Days</span>
                                                                <span className="font-medium">$700</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>60 Days</span>
                                                                <span className="font-medium">$1,400</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dog Pricing */}
                                                <div className="bg-white/80 rounded-lg p-2.5">
                                                    <h4 className="font-semibold text-primary-700 mb-1.5 flex items-center gap-1">
                                                        Dog Boarding
                                                    </h4>
                                                    <div className="space-y-1 text-neutral-700">
                                                        <div className="flex justify-between">
                                                            <span>Small (&lt;30 lbs)</span>
                                                            <span className="font-medium">$40/night</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Large (&gt;30 lbs)</span>
                                                            <span className="font-medium">$60/night</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>2 Small Dogs</span>
                                                            <span className="font-medium">$70/night</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>2 Large Dogs</span>
                                                            <span className="font-medium">$110/night</span>
                                                        </div>
                                                        <div className="pt-1.5 mt-1.5 border-t border-neutral-200">
                                                            <div className="font-medium text-primary-600 mb-0.5">30-Day Package:</div>
                                                            <div className="flex justify-between">
                                                                <span>Small Dog</span>
                                                                <span className="font-medium">$1,000</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Large Dog</span>
                                                                <span className="font-medium">$1,500</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Daycare */}
                                                <div className="bg-white/80 rounded-lg p-2.5">
                                                    <h4 className="font-semibold text-primary-700 mb-1.5 flex items-center gap-1">
                                                        Dog Daycare (10 Hours)
                                                    </h4>
                                                    <div className="space-y-1 text-neutral-700">
                                                        <div className="flex justify-between">
                                                            <span>Small Dog</span>
                                                            <span className="font-medium">$25/day</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Large Dog</span>
                                                            <span className="font-medium">$30/day</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                // Regular cards for other services (desktop)
                                <>
                                    {service.popular && (
                                        <motion.div
                                            className="absolute -top-3 -right-3 z-10"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.4 + index * 0.05, type: 'spring' }}
                                        >
                                            <div className="bg-neutral-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-soft-lg">
                                                <Star className="w-3 h-3 fill-white" />
                                                Popular
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.div
                                        className={`bg-white rounded-2xl shadow-soft p-6 h-full transition-all duration-500 border-2 ${
                                            hoveredService === index
                                                ? 'border-primary-700 shadow-soft-xl'
                                                : 'border-transparent'
                                        }`}
                                        whileHover={{ y: -5 }}
                                        onMouseEnter={() => setHoveredService(index)}
                                        onMouseLeave={() => setHoveredService(null)}
                                    >
                                        <motion.div
                                            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ${
                                                hoveredService === index
                                                    ? 'bg-primary-700 text-white shadow-soft-lg'
                                                    : 'bg-neutral-100 text-neutral-700'
                                            }`}
                                            whileHover={{ rotate: [0, -10, 10, 0] }}
                                        >
                                            <service.icon className="w-7 h-7" />
                                        </motion.div>

                                        <h3 className="text-xl font-bold mb-2 text-neutral-900">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-neutral-600 mb-4">
                                            {service.description}
                                        </p>

                                        {service.price !== 'Included with boarding' && (
                                            <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-lg border border-primary-100">
                                                <p className="text-sm text-primary-700 font-semibold">
                                                    {service.price}
                                                </p>
                                            </div>
                                        )}

                                        <ul className="space-y-2">
                                            {service.features.map((feature, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    className="flex items-start gap-2"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-[2px] transition-all ${
                                                            hoveredService === index
                                                                ? 'bg-primary-700'
                                                                : 'bg-neutral-200'
                                                        }`}
                                                    >
                                                        <motion.div
                                                            className="w-2 h-2 bg-white rounded-full"
                                                            initial={{ scale: 0 }}
                                                            animate={
                                                                hoveredService === index
                                                                    ? { scale: 1 }
                                                                    : { scale: 0.6 }
                                                            }
                                                        />
                                                    </div>
                                                    <span className="text-sm text-neutral-700">
                                                        {feature}
                                                    </span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA - Simplified for mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 md:mt-16 text-center"
                >
                    <div className="bg-gradient-to-br from-neutral-50 to-primary-50/30 rounded-3xl p-5 sm:p-8 max-w-4xl mx-auto border border-neutral-200">
                        <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
                            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary-700" />
                            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-700" />
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary-700" />
                        </div>

                        <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-neutral-900">
                            Quality Guarantee
                        </h3>

                        <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
                            Licensed, insured, and pet first aid certified.
                        </p>

                        <motion.button
                            className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Book Now <ArrowRight className="inline w-4 h-4 ml-1" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </section>
    )
}