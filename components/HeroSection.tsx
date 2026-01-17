'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, Star, Heart } from 'lucide-react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

export default function HeroSection() {
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [textIndex, setTextIndex] = useState(0)
    const { scrollY } = useScroll()

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 300], [0, 100])
    const y2 = useTransform(scrollY, [0, 300], [0, -100])
    const opacity = useTransform(scrollY, [0, 200], [1, 0])
    const scale = useTransform(scrollY, [0, 200], [1, 1.2])

    const titles = ['Premium Pet Care', 'Luxury Boarding', 'Home Away From Home']

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)

        const interval = setInterval(() => {
            setTextIndex(prev => (prev + 1) % titles.length)
        }, 3000)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            clearInterval(interval)
        }
    }, [])

    return (
        <motion.section
            className="relative min-h-screen flex items-center bg-gradient-subtle overflow-hidden"
            style={{ scale, opacity }}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-0 -left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary-200 rounded-full opacity-10 blur-3xl"
                    style={{ y: y1 }}
                    animate={{
                        x: mousePosition.x * 0.02,
                        y: mousePosition.y * 0.02
                    }}
                    transition={{ type: 'spring', stiffness: 50 }}
                />
                <motion.div
                    className="absolute bottom-0 -right-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-neutral-200 rounded-full opacity-10 blur-3xl"
                    style={{ y: y2 }}
                    animate={{
                        x: mousePosition.x * -0.02,
                        y: mousePosition.y * -0.02
                    }}
                    transition={{ type: 'spring', stiffness: 50 }}
                />
            </div>

            {/* Interactive Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 md:w-2 md:h-2 bg-primary-700/10 rounded-full"
                        initial={{
                            x:
                                Math.random() *
                                (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y:
                                Math.random() *
                                (typeof window !== 'undefined' ? window.innerHeight : 800)
                        }}
                        animate={{
                            x: [
                                null,
                                Math.random() *
                                (typeof window !== 'undefined' ? window.innerWidth : 1000)
                            ],
                            y: [
                                null,
                                Math.random() *
                                (typeof window !== 'undefined' ? window.innerHeight : 800)
                            ]
                        }}
                        transition={{
                            duration: 20 + Math.random() * 20,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'linear'
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Main Hero Content Container */}
                <div className="flex items-center justify-center min-h-[70vh]">
                    <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl gap-6 lg:gap-10 xl:gap-14">
                        {/* ===== 左侧 SVG：Mobile 版本（lg 以下显示） ===== */}
                        <motion.div
                            className="flex-shrink-0 flex justify-center w-full mb-2 mt-10 lg:hidden mt-50"
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                y: [0, -8, 0],
                                scale: 1.0
                            }}
                            transition={{
                                delay: 0.4,
                                duration: 0.8,
                                y: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }
                            }}
                        >
                            <Image
                                src="/svgs/left-decoration.svg"
                                alt="Cat decoration"
                                width={180}
                                height={180}
                                className="w-24 h-24 sm:w-28 sm:h-28 opacity-80 scale-150"
                                priority
                            />
                        </motion.div>

                        {/* ===== 左侧 SVG：Desktop 版本（lg 及以上显示） ===== */}
                        <motion.div
                            className="hidden lg:flex flex-shrink-0 justify-end lg:w-auto lg:mr-4 xl:mr-8 2xl:mr-10 lg:mt-0"
                            initial={{ opacity: 0, x: -50, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                x: 30,
                                scale: 2.6,
                                y: [0, -10, 0]
                            }}
                            transition={{
                                delay: 0.5,
                                duration: 0.8,
                                y: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }
                            }}
                        >
                            <Image
                                src="/svgs/left-decoration.svg"
                                alt="Cat decoration"
                                width={250}
                                height={250}
                                className="lg:w-40 lg:h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 opacity-80"
                                priority
                            />
                        </motion.div>

                        {/* Center Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="flex-1 max-w-4xl px-2 sm:px-4 lg:px-6 text-center"
                        >
                            {/* Animated Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex justify-center mb-4 md:mb-8"
                            >
                                <motion.div
                                    className="inline-flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-full shadow-soft-md hover:shadow-soft-lg transition-all cursor-pointer text-sm md:text-base"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-primary-700" />
                                    </motion.div>
                                    <span className="text-xs md:text-sm font-medium text-neutral-800">
                                        Licensed & Insured Since 2019
                                    </span>
                                </motion.div>
                            </motion.div>

                            {/* Main Title and Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {/* Title Container with fixed height */}
                                <div className="mb-8 md:mb-10">
                                    <div className="h-[70px] md:h-[90px] lg:h-[110px] xl:h-[130px] flex items-center justify-center mb-4">
                                        <AnimatePresence mode="wait">
                                            <motion.h1
                                                key={textIndex}
                                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display font-bold text-neutral-900 leading-tight"
                                                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                exit={{ opacity: 0, y: -50, rotateX: 90 }}
                                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                                style={{ transformStyle: 'preserve-3d' }}
                                            >
                                                <span className="inline-block">
                                                    {titles[textIndex]}
                                                </span>
                                            </motion.h1>
                                        </AnimatePresence>
                                    </div>

                                    <motion.div
                                        className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-normal text-neutral-600"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        in Wellesley Hills
                                    </motion.div>
                                </div>

                                {/* Description Paragraph */}
                                <motion.p
                                    className="text-base md:text-lg lg:text-xl xl:text-2xl text-neutral-600 max-w-3xl mx-auto mb-4 md:mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    Personalized home boarding for your beloved pets.
                                    Lovingly welcomed for{' '}
                                    <motion.span
                                        className="font-semibold text-neutral-900 border-b-2 border-primary-700 inline-block"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        15 cats
                                    </motion.span>{' '}
                                    and{' '}
                                    <motion.span
                                        className="font-semibold text-neutral-900 border-b-2 border-primary-700 inline-block"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        17 dogs
                                    </motion.span>{' '}
                                </motion.p>

                                {/* Pricing Info */}
                                <motion.div
                                    className="text-base md:text-lg lg:text-xl text-primary-700 font-semibold max-w-3xl mx-auto mb-8 md:mb-10"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7, type: "spring" }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div>Cat: $25/night | Dog: $40-60/night</div>
                                    <div>Dog Daycare: $25-30 (10 Hours)</div>
                                </motion.div>
                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative group"
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-primary-700 rounded-lg blur-lg opacity-20"
                                            animate={{
                                                opacity: [0.2, 0.3, 0.2]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity
                                            }}
                                        />
                                        <Link
                                            href="#booking"
                                            className="magnetic-button relative inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-primary-700 text-white rounded-lg font-medium transition-all hover:bg-primary-800 hover:shadow-soft-xl group overflow-hidden text-sm md:text-base"
                                        >
                                            <span className="relative z-10">Reserve Your Spot</span>
                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                        </Link>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            href="#current-pets"
                                            className="magnetic-button inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/90 backdrop-blur-md text-neutral-700 border-2 border-neutral-200 rounded-lg font-medium transition-all hover:border-primary-700 hover:text-primary-700 hover:shadow-soft-lg group text-sm md:text-base"
                                        >
                                            <span>Meet Our Residents</span>
                                            <motion.span
                                                className="inline-block"
                                                animate={{ x: [0, 3, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                →
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* ===== 右侧 SVG：Mobile 版本（lg 以下显示） ===== */}
                        <motion.div
                            className="flex-shrink-0 flex justify-center w-full mt-2 lg:hidden"
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                y: [0, 10, 0],
                                scale: 1.2
                            }}
                            transition={{
                                delay: 0.5,
                                duration: 0.8,
                                y: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: 2
                                }
                            }}
                        >
                            <Image
                                src="/svgs/right-decoration.svg"
                                alt="Dog decoration"
                                width={180}
                                height={180}
                                className="w-24 h-24 sm:w-28 sm:h-28 opacity-80"
                                priority
                            />
                        </motion.div>

                        {/* ===== 右侧 SVG：Desktop 版本（lg 及以上显示） ===== */}
                        <motion.div
                            className="hidden lg:flex flex-shrink-0 justify-start lg:w-auto lg:ml-4 xl:ml-8 2xl:ml-10 lg:mt-0"
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                scale: 2.3,
                                y: [0, 10, 0]
                            }}
                            transition={{
                                delay: 0.6,
                                duration: 0.8,
                                y: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: 2
                                }
                            }}
                        >
                            <Image
                                src="/svgs/right-decoration.svg"
                                alt="Dog decoration"
                                width={250}
                                height={250}
                                className="lg:w-40 lg:h-40 xl:w-48 xl:h-48 2xl:w-560 2xl:h-56 opacity-80"
                                priority
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Stats Cards Section */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto perspective-1000 px-4 md:px-0 mt-12"
                >
                    {[
                        { value: 500, label: 'Happy Pets', suffix: '+', icon: Heart },
                        { value: 4.9, label: 'Star Rating', decimals: 1, icon: Star },
                        { value: 100, label: 'Safety Record', suffix: '%', icon: CheckCircle },
                        { value: 50, label: 'Mile Radius', icon: Heart }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10, rotateY: -30 }}
                            animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{
                                y: -10,
                                rotateY: 10,
                                scale: 1.05
                            }}
                            className="text-center group cursor-pointer transform-gpu"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <motion.div
                                className="bg-white/90 backdrop-blur-md rounded-xl p-3 md:p-4 shadow-soft hover:shadow-soft-xl transition-all border border-neutral-100"
                                whileHover={{
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-primary-700"
                                >
                                    <stat.icon className="w-full h-full" />
                                </motion.div>
                                <div className="text-xl md:text-3xl lg:text-4xl font-bold text-primary-700 mb-1">
                                    {inView && (
                                        <CountUp
                                            end={stat.value}
                                            decimals={stat.decimals || 0}
                                            suffix={stat.suffix || ''}
                                            duration={2}
                                        />
                                    )}
                                </div>
                                <p className="text-xs md:text-sm text-neutral-500 font-medium uppercase tracking-wide group-hover:text-neutral-700 transition-colors">
                                    {stat.label}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Floating Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto px-4 md:px-0"
                >
                    {[
                        {
                            title: '24/7 Supervision',
                            desc: 'Round-the-clock care in a home environment',
                            delay: 0
                        },
                        {
                            title: 'Daily Updates',
                            desc: 'Photos and videos sent throughout the day',
                            delay: 0.1
                        },
                        {
                            title: 'Personalized Care',
                            desc: "Tailored to each pet's unique needs",
                            delay: 0.2
                        }
                    ].map(feature => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 + feature.delay }}
                            whileHover={{
                                y: -5,
                                scale: 1.02
                            }}
                            className="glass-card p-4 md:p-6 rounded-xl cursor-pointer group"
                        >
                            <motion.div
                                className="w-10 h-10 md:w-12 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary-700 transition-colors"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-700 group-hover:text-white transition-colors" />
                            </motion.div>
                            <h3 className="font-semibold text-neutral-900 mb-2 text-sm md:text-base">
                                {feature.title}
                            </h3>
                            <p className="text-xs md:text-sm text-neutral-600">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Interactive Scroll Indicator */}
            <motion.div
                className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                onClick={() =>
                    document.getElementById('current-pets')?.scrollIntoView({ behavior: 'smooth' })
                }
                whileHover={{ scale: 1.1 }}
            >
                <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center hover:border-primary-700 transition-colors">
                    <motion.div
                        className="w-1.5 h-3 bg-neutral-600 rounded-full mt-2"
                        animate={{ y: [0, 10, 0], opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    />
                </div>
            </motion.div>

            <style jsx>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
                }
                .magnetic-button {
                    position: relative;
                    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </motion.section>
    )
}