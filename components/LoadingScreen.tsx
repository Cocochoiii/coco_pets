'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { PawPrint } from 'lucide-react';
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
    const [dimensions, setDimensions] = useState({ width: 1000, height: 800 })

    useEffect(() => {
        // Only access window in useEffect to avoid SSR issues
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }, [])

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-white z-[100] flex items-center justify-center"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="inline-block mb-4"
                    >
                        <PawPrint className="w-16 h-16 text-primary-700" />
                    </motion.div>

                    <motion.h1
                        className="text-2xl font-bold text-neutral-900 mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Coco's Pet Paradise
                    </motion.h1>

                    <motion.div
                        className="flex gap-1 justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-primary-700 rounded-full"
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Paw prints animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-4xl opacity-10"
                            initial={{
                                x: Math.random() * dimensions.width,
                                y: dimensions.height + 100
                            }}
                            animate={{
                                y: -100,
                                rotate: Math.random() * 360,
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: i * 0.5,
                                ease: "linear"
                            }}
                        >

                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}