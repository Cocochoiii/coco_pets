'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Particle = {
    id: number
    x: number
    y: number
    dx: number
    dy: number
    size: number
    duration: number
}

export default function InteractiveBackground() {
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // 控制出现频率：偶尔才生成一个粒子
            if (Math.random() > 0.93) {
                const newParticle: Particle = {
                    id: Date.now() + Math.random(),
                    x: e.clientX,
                    y: e.clientY,
                    dx: (Math.random() - 0.5) * 160, // 漂浮范围更大一点
                    dy: (Math.random() - 0.5) * 160,
                    size: 4 + Math.random() * 10, // 4px - 14px
                    duration: 2 + Math.random() * 1.5 // 2 - 3.5s
                }
                // 只保留最近的 25 个粒子，避免太密集
                setParticles(prev => [...prev.slice(-24), newParticle])
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {/* 鼠标拖尾粒子 */}
            <AnimatePresence>
                {particles.map(particle => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full"
                        initial={{
                            x: particle.x,
                            y: particle.y,
                            scale: 0,
                            opacity: 0
                        }}
                        animate={{
                            x: particle.x + particle.dx,
                            y: particle.y + particle.dy,
                            scale: [0, 1.25, 0.9],
                            opacity: [0, 0.6, 0],
                            rotate: [0, 15, -10]
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: particle.duration, ease: 'easeOut' }}
                        style={{
                            width: particle.size,
                            height: particle.size,
                            background:
                                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(244, 187, 187, 0.12), rgba(249, 243, 239, 0.03))',
                            boxShadow: '0 0 24px rgba(244, 187, 187, 0.4)'
                        }}
                        onAnimationComplete={() => {
                            setParticles(prev =>
                                prev.filter(p => p.id !== particle.id)
                            )
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* 大范围柔和渐变 Orbs：保持原来的色调，但层次更丰富 */}
            <motion.div
                className="absolute -top-40 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-70"
                style={{
                    background:
                        'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9), rgba(248, 215, 200, 0.38), rgba(248, 215, 200, 0.05))'
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 40, 0],
                    y: [0, -30, 0],
                    rotate: [0, 12, 0]
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            <motion.div
                className="absolute bottom-[-160px] right-[-80px] w-[460px] h-[460px] rounded-full blur-3xl opacity-60"
                style={{
                    background:
                        'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.8), rgba(250, 204, 204, 0.3), rgba(15, 23, 42, 0.24))'
                }}
                animate={{
                    scale: [1.05, 0.95, 1.05],
                    x: [0, -50, 0],
                    y: [0, 40, 0],
                    rotate: [0, -10, 0]
                }}
                transition={{
                    duration: 26,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            {/* 细长光带，增加一点层次感 */}
            <motion.div
                className="absolute top-1/3 left-0 right-0 h-24 opacity-50"
                style={{
                    background:
                        'linear-gradient(90deg, rgba(248, 215, 200, 0) 0%, rgba(248, 215, 200, 0.25) 40%, rgba(248, 215, 200, 0) 100%)'
                }}
                animate={{
                    x: ['-10%', '10%', '-10%'],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            <motion.div
                className="absolute bottom-1/4 left-[-100px] w-[260px] h-[260px] rounded-full blur-2xl opacity-60"
                style={{
                    background:
                        'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.85), rgba(249, 231, 218, 0.35), rgba(249, 231, 218, 0))'
                }}
                animate={{
                    scale: [0.9, 1.05, 0.9],
                    y: [0, 24, 0]
                }}
                transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
        </div>
    )
}
