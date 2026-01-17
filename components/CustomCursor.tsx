'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PawPrint } from 'lucide-react'

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isPointer, setIsPointer] = useState(false)
    const [isHidden, setIsHidden] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.style.cursor === 'pointer'
            ) {
                setIsPointer(true)
            }
        }

        const handleMouseLeave = () => {
            setIsPointer(false)
        }

        const handleMouseOut = () => {
            setIsHidden(true)
        }

        const handleMouseOver = () => {
            setIsHidden(false)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseover', handleMouseEnter)
        window.addEventListener('mouseout', handleMouseLeave)
        document.addEventListener('mouseenter', handleMouseOver)
        document.addEventListener('mouseleave', handleMouseOut)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleMouseEnter)
            window.removeEventListener('mouseout', handleMouseLeave)
            document.removeEventListener('mouseenter', handleMouseOver)
            document.removeEventListener('mouseleave', handleMouseOut)
        }
    }, [])

    return (
        <>
            {/* Paw cursor for desktop only */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
                animate={{
                    x: mousePosition.x - 12,
                    y: mousePosition.y - 12,
                    scale: isPointer ? 1.2 : 1,
                    opacity: isHidden ? 0 : 1,
                    rotate: isPointer ? 15 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5,
                }}
            >
                <PawPrint className={`w-6 h-6 ${isPointer ? 'text-primary-700' : 'text-primary-500'} drop-shadow-md transition-colors duration-200`} />
            </motion.div>

            {/* Small dot indicator for precision */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[10000] hidden lg:block"
                animate={{
                    x: mousePosition.x - 2,
                    y: mousePosition.y - 2,
                    opacity: isHidden ? 0 : isPointer ? 1 : 0.5,
                }}
                transition={{
                    type: "spring",
                    stiffness: 2000,
                    damping: 30,
                    mass: 0.1,
                }}
            >
                <div className="w-1 h-1 bg-primary-700 rounded-full" />
            </motion.div>
        </>
    )
}
