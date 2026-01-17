'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useMemo } from 'react'

const SECTIONS = [
    { id: 'hero', label: 'Top' },
    { id: 'services', label: 'Services' },
    { id: 'current-pets', label: 'Our Pets' },
    { id: 'service-area', label: 'Service Area' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'booking', label: 'Booking' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
]

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()

    const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
    const opacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1])

    // 根据 section 个数动态生成每一段的范围
    const ranges = useMemo(() => {
        const count = SECTIONS.length
        return SECTIONS.map((_, i) => {
            const start = i / count
            const end = (i + 1) / count
            return { start, end }
        })
    }, [])

    const handleJump = (id: string) => {
        if (typeof document === 'undefined') return
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (id === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <>
            {/* Top Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-neutral-200 z-50"
                style={{ opacity }}
            >
                <motion.div
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-700"
                    style={{ width }}
                />
            </motion.div>

            {/* Side Progress Indicator + Section Nav (桌面端) */}
            <motion.div
                className="fixed right-6 2xl:right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2"
                style={{ opacity }}
            >
                {SECTIONS.map((section, i) => (
                    <motion.button
                        key={section.id}
                        className="group relative w-2 h-10 rounded-full bg-neutral-200/80 overflow-hidden flex items-end justify-center"
                        onClick={() => handleJump(section.id)}
                        whileHover={{ scale: 1.05, x: -2 }}
                    >
                        {/* 填充条 */}
                        <motion.div
                            className="w-full bg-primary-700"
                            style={{
                                height: useTransform(
                                    scrollYProgress,
                                    [ranges[i].start, ranges[i].end],
                                    ['0%', '100%']
                                )
                            }}
                        />

                        {/* 小圆点 */}
                        <motion.div
                            className="absolute -right-1 w-2.5 h-2.5 rounded-full bg-white shadow-md border border-primary-600 opacity-0 group-hover:opacity-100"
                            layout
                        />

                        {/* Tooltip */}
                        <motion.div
                            className="absolute right-8 px-2 py-1 rounded-lg bg-neutral-900/90 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
                            initial={{ x: 10, y: 0 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {section.label}
                        </motion.div>
                    </motion.button>
                ))}
            </motion.div>

            {/* Mobile 小圆环进度（右下角） */}
            <motion.button
                className="fixed bottom-4 right-4 z-40 flex items-center justify-center rounded-full shadow-soft-lg bg-white/90 border border-neutral-200 backdrop-blur-md xl:hidden"
                style={{ opacity }}
                onClick={() => {
                    if (typeof window !== 'undefined') {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg className="w-10 h-10 -rotate-90">
                    <circle
                        cx="20"
                        cy="20"
                        r="16"
                        className="stroke-neutral-200"
                        strokeWidth="3"
                        fill="none"
                    />
                    <motion.circle
                        cx="20"
                        cy="20"
                        r="16"
                        className="stroke-primary-700"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        style={{
                            pathLength: scrollYProgress
                        }}
                    />
                </svg>
                <span className="absolute text-[10px] font-semibold text-neutral-700">
                    Top
                </span>
            </motion.button>
        </>
    )
}
