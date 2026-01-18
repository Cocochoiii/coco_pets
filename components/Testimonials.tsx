'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, Quote, Heart, ThumbsUp } from 'lucide-react'
import { useState } from 'react'

interface Testimonial {
    id: number
    name: string
    pet: string
    petType: 'cat' | 'dog'
    rating: number
    text: string
    date: string
    image?: string
    helpful: number
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Sarah Johnson',
        pet: 'Luna (Persian Cat)',
        petType: 'cat',
        rating: 5,
        text: "Coco is absolutely amazing! Luna can be very shy with strangers, but she warmed up to Coco immediately. The daily photos and videos gave me such peace of mind during my two-week vacation. I could see Luna was happy and well-cared for. Will definitely book again!",
        date: '2 weeks ago',
        helpful: 23
    },
    {
        id: 2,
        name: 'Michael Chen',
        pet: 'Max & Bailey (Golden Retrievers)',
        petType: 'dog',
        rating: 5,
        text: "Best pet boarding experience ever! My dogs came back happy, clean, and well-exercised. They actually seemed sad to leave! The facilities are clean, spacious, and the personal attention each pet receives is outstanding. Highly recommend!",
        date: '1 month ago',
        helpful: 19
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        pet: 'Mochi (Scottish Fold)',
        petType: 'cat',
        rating: 5,
        text: "Coco went above and beyond caring for Mochi's special dietary needs. She sent detailed updates about his eating habits and even noticed he preferred a specific play time. Her attention to detail and genuine love for animals shows in everything she does.",
        date: '2 months ago',
        helpful: 31
    },
    {
        id: 4,
        name: 'David Thompson',
        pet: 'Charlie (Border Collie)',
        petType: 'dog',
        rating: 5,
        text: "As a first-time pet boarder, I was nervous leaving Charlie. Coco's meet-and-greet session put all my worries to rest. Charlie had the time of his life with daily activities and made so many furry friends. The video updates were the highlight of my day!",
        date: '3 weeks ago',
        helpful: 27
    },
    {
        id: 5,
        name: 'Lisa Wang',
        pet: 'Whiskers (Ragdoll)',
        petType: 'cat',
        rating: 5,
        text: "I've tried other pet boarding services, but none compare to Coco's. The home environment is so much better than a traditional kennel. Whiskers actually gained confidence and became more social after his stay. Amazing experience!",
        date: '1 month ago',
        helpful: 15
    },
    {
        id: 6,
        name: 'James Miller',
        pet: 'Duke (Labrador)',
        petType: 'dog',
        rating: 5,
        text: "Duke has separation anxiety, but Coco handled it like a pro. She kept him engaged with activities and gave him extra attention when needed. I received updates showing him playing happily with other dogs. Couldn't ask for better care!",
        date: '5 weeks ago',
        helpful: 22
    }
]

export default function Testimonials() {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'cat' | 'dog'>('all')
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const [likedReviews, setLikedReviews] = useState<number[]>([])

    const filteredTestimonials =
        selectedFilter === 'all'
            ? testimonials
            : testimonials.filter(t => t.petType === selectedFilter)

    const handleLike = (id: number) => {
        if (likedReviews.includes(id)) {
            setLikedReviews(likedReviews.filter(reviewId => reviewId !== id))
        } else {
            setLikedReviews([...likedReviews, id])
        }
    }

    return (
        <section id="testimonials" className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-neutral-50 to-white">
            <div className="container mx-auto px-4">
                {/* ===== Title + SVG ===== */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-12 relative"
                >
                    {/* Mobile SVGs */}
                    <div className="flex items-center justify-center gap-10 mb-4 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src="/svgs/testimonials-decoration2.svg"
                                alt="Testimonials decoration left"
                                width={120}
                                height={120}
                                className="w-36 h-36 opacity-90"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Image
                                src="/svgs/testimonials-decoration.svg"
                                alt="Testimonials decoration right"
                                width={120}
                                height={120}
                                className="w-36 h-36 opacity-90"
                            />
                        </motion.div>
                    </div>

                    {/* LEFT SVG - Desktop only */}
                    <motion.div
                        className="hidden lg:block absolute top-4 left-0 flex-shrink-0 mr-6 xl:mr-8"
                        initial={{ opacity: 0, x: -50, scale: 2.0 }}
                        whileInView={{
                            opacity: 1,
                            x: -10,
                            scale: 2.0,
                            y: [0, 10, 0]
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
                            src="/svgs/testimonials-decoration2.svg"
                            alt="Testimonials decoration left"
                            width={200}
                            height={200}
                            className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 opacity-90"
                            priority
                        />
                    </motion.div>

                    {/* RIGHT SVG - Desktop only */}
                    <motion.div
                        className="hidden lg:block absolute top-4 right-0 flex-shrink-0 ml-6 xl:ml-8"
                        initial={{ opacity: 0, x: 50, scale: 2.0 }}
                        whileInView={{
                            opacity: 1,
                            x: 10,
                            scale: 2.0,
                            y: [0, -10, 0]
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
                            src="/svgs/testimonials-decoration.svg"
                            alt="Testimonials decoration right"
                            width={200}
                            height={200}
                            className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 opacity-90"
                        />
                    </motion.div>

                    {/* Center Title */}
                    <div className="text-center mb-8">
                        <span className="text-primary-700 font-semibold text-sm uppercase tracking-wide">
                            Testimonials
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mt-2 mb-4 text-neutral-800">
                            What Pet Parents Say
                        </h2>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto text-center">
                        Don&apos;t just take our word for it – hear from the families who trust us with their beloved pets
                    </p>
                </motion.div>

                {/* ===== Filter Buttons ===== */}
                <div className="flex justify-center gap-2 sm:gap-4 mb-12">
                    <motion.button
                        onClick={() => setSelectedFilter('all')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 relative overflow-hidden text-xs sm:text-base whitespace-nowrap ${
                            selectedFilter === 'all'
                                ? 'bg-neutral-900 text-white shadow-soft-lg'
                                : 'bg-white text-neutral-700 border-2 border-neutral-200 shadow-soft hover:shadow-soft-md hover:border-neutral-400'
                        }`}
                    >
                        <span className="relative z-10">
                            All Reviews ({testimonials.length})
                        </span>
                        {selectedFilter === 'all' && (
                            <motion.div
                                className="absolute inset-0 bg-primary-700"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </motion.button>

                    <motion.button
                        onClick={() => setSelectedFilter('cat')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-base whitespace-nowrap ${
                            selectedFilter === 'cat'
                                ? 'bg-neutral-900 text-white shadow-soft-lg'
                                : 'bg-white text-neutral-700 border-2 border-neutral-200 shadow-soft hover:shadow-soft-md hover:border-neutral-400'
                        }`}
                    >
                        Cat Parents
                    </motion.button>

                    <motion.button
                        onClick={() => setSelectedFilter('dog')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-base whitespace-nowrap ${
                            selectedFilter === 'dog'
                                ? 'bg-neutral-900 text-white shadow-soft-lg'
                                : 'bg-white text-neutral-700 border-2 border-neutral-200 shadow-soft hover:shadow-soft-md hover:border-neutral-400'
                        }`}
                    >
                        Dog Parents
                    </motion.button>
                </div>

                {/* ===== Mobile Horizontal Scroll Testimonials ===== */}
                <div className="sm:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex gap-4 pb-4 pt-3" style={{ width: 'max-content' }}>
                        {filteredTestimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex-shrink-0"
                                style={{ width: '300px' }}
                            >
                                <motion.div
                                    className={`bg-white p-4 rounded-xl border-2 transition-all duration-300 h-full relative ${
                                        hoveredCard === testimonial.id
                                            ? 'border-primary-700 shadow-soft-xl'
                                            : 'border-neutral-100 shadow-soft'
                                    }`}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Pet Type Badge - Inside card */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <motion.div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-soft-md ${
                                                testimonial.petType === 'cat'
                                                    ? 'bg-gradient-to-br from-primary-100 to-primary-200'
                                                    : 'bg-gradient-to-br from-neutral-100 to-neutral-200'
                                            }`}
                                        >
                                            <span className="text-sm">
                                                {testimonial.petType === 'cat' ? '🐾' : '🦴'}
                                            </span>
                                        </motion.div>
                                    </div>

                                    {/* Quote Icon */}
                                    <div className="absolute top-3 right-3">
                                        <Quote className="h-6 w-6 text-neutral-200" />
                                    </div>

                                    {/* Content */}
                                    <div className="pt-10">
                                        {/* Rating Stars */}
                                        <div className="flex gap-1 mb-3">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-primary-700 text-primary-700" />
                                            ))}
                                        </div>

                                        {/* Text */}
                                        <p className="text-sm text-neutral-700 mb-4 italic leading-relaxed line-clamp-5">
                                            &quot;{testimonial.text}&quot;
                                        </p>

                                        {/* Reviewer Info */}
                                        <div className="border-t border-neutral-100 pt-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-neutral-900 text-sm">
                                                        {testimonial.name}
                                                    </p>
                                                    <p className="text-xs text-neutral-600 flex items-center gap-1 truncate">
                                                        {testimonial.petType === 'cat' ? '🐱' : '🐕'} {testimonial.pet}
                                                    </p>
                                                    <p className="text-[10px] text-neutral-500 mt-1">
                                                        {testimonial.date}
                                                    </p>
                                                </div>
                                                <motion.button
                                                    onClick={() => handleLike(testimonial.id)}
                                                    className={`flex items-center gap-1 text-xs transition-colors ${
                                                        likedReviews.includes(testimonial.id)
                                                            ? 'text-primary-700'
                                                            : 'text-neutral-400'
                                                    }`}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <ThumbsUp
                                                        className={`h-3 w-3 ${
                                                            likedReviews.includes(testimonial.id)
                                                                ? 'fill-primary-700'
                                                                : ''
                                                        }`}
                                                    />
                                                    <span>
                                                        {testimonial.helpful +
                                                            (likedReviews.includes(testimonial.id) ? 1 : 0)}
                                                    </span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
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

                {/* ===== Desktop/Tablet Grid ===== */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {filteredTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredCard(testimonial.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className="relative"
                        >
                            <motion.div
                                className={`bg-white p-5 rounded-2xl border-2 transition-all duration-300 ${
                                    hoveredCard === testimonial.id
                                        ? 'border-primary-700 shadow-soft-xl'
                                        : 'border-neutral-100 shadow-soft'
                                }`}
                                whileHover={{ y: -5 }}
                            >
                                {/* Quote Icon */}
                                <motion.div
                                    animate={{
                                        rotate: hoveredCard === testimonial.id ? 180 : 0,
                                        scale: hoveredCard === testimonial.id ? 1.1 : 1
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute top-3 right-3"
                                >
                                    <Quote className="h-7 w-7 text-neutral-200" />
                                </motion.div>

                                {/* Rating Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.08 * i, type: 'spring' }}
                                        >
                                            <Star className="h-4 w-4 fill-primary-700 text-primary-700" />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-base text-neutral-700 mb-6 italic leading-relaxed">
                                    &quot;{testimonial.text}&quot;
                                </p>

                                {/* Reviewer Info */}
                                <div className="border-t border-neutral-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-neutral-900 text-base">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-sm text-neutral-600 flex items-center gap-1">
                                                {testimonial.petType === 'cat' ? '🐱' : '🐕'} {testimonial.pet}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                {testimonial.date}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <motion.button
                                                onClick={() => handleLike(testimonial.id)}
                                                className={`flex items-center justify-end gap-1 text-sm transition-colors ${
                                                    likedReviews.includes(testimonial.id)
                                                        ? 'text-primary-700'
                                                        : 'text-neutral-400 hover:text-primary-700'
                                                }`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <ThumbsUp
                                                    className={`h-4 w-4 ${
                                                        likedReviews.includes(testimonial.id)
                                                            ? 'fill-primary-700'
                                                            : ''
                                                    }`}
                                                />
                                                <span>
                                                    {testimonial.helpful +
                                                        (likedReviews.includes(testimonial.id) ? 1 : 0)}
                                                </span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                {/* Pet Type Badge */}
                                <motion.div
                                    className={`absolute -top-2 -left-2 w-9 h-9 rounded-full flex items-center justify-center shadow-soft-md ${
                                        testimonial.petType === 'cat'
                                            ? 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700'
                                            : 'bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-700'
                                    }`}
                                    animate={{ rotate: hoveredCard === testimonial.id ? 360 : 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="text-sm">
                                        {testimonial.petType === 'cat' ? '🐾' : '🦴'}
                                    </span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* ===== CTA ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <motion.div
                        className="bg-gradient-to-br from-primary-50 to-neutral-50 rounded-2xl shadow-soft-xl border-2 border-primary-100 p-6 sm:p-8 max-w-2xl mx-auto relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="mb-4"
                        >
                            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-primary-700 mx-auto" />
                        </motion.div>
                        <h3 className="text-xl sm:text-2xl font-display font-bold mb-2 text-neutral-900">
                            Join Our Happy Pet Family!
                        </h3>
                        <p className="text-sm sm:text-base text-neutral-600 mb-6">
                            Experience the difference of personalized, home-style pet care
                        </p>
                        <motion.button
                            className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full relative overflow-hidden text-sm sm:text-base"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10">Book Your Pet&apos;s Stay Today</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                        </motion.button>
                        <div className="absolute -bottom-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-primary-700 opacity-5 rounded-full blur-2xl" />
                        <div className="absolute -top-10 -left-10 w-32 sm:w-40 h-32 sm:h-40 bg-neutral-700 opacity-5 rounded-full blur-2xl" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}