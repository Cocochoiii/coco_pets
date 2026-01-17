'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface SectionTransitionProps {
    children: React.ReactNode
    className?: string
}

export default function SectionTransition({ children, className = '' }: SectionTransitionProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, margin: "-100px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={isInView ? { scale: 1 } : { scale: 0.95 }}
                transition={{
                    duration: 1,
                    ease: "easeOut"
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    )
}