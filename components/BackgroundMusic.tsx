'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music } from 'lucide-react'
import { useMusic } from '@/contexts/MusicContext'

export default function BackgroundMusic() {
    const [showVolumeSlider, setShowVolumeSlider] = useState(false)
    const { isPlaying, volume, togglePlay, setVolume } = useMusic()

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value))
    }

    return (
        <motion.div
            className="fixed bottom-20 right-4 sm:right-6 xl:bottom-6 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        >
            <div className="relative">
                <motion.button
                    onClick={togglePlay}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                    className={`relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-soft-xl hover:shadow-soft-2xl transition-all ${
                        isPlaying
                            ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
                            : 'bg-gradient-to-br from-neutral-600 to-neutral-700 text-white'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <AnimatePresence mode="wait">
                        {isPlaying ? (
                            <motion.div
                                key="playing"
                                initial={{ rotate: -180, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 180, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="muted"
                                initial={{ rotate: 180, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -180, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isPlaying && (
                        <motion.div
                            className="absolute inset-0 rounded-xl sm:rounded-2xl"
                            animate={{ scale: [1, 1.4, 1.4], opacity: [0.3, 0, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ background: 'radial-gradient(circle, rgba(212, 165, 165, 0.4), transparent)' }}
                        />
                    )}
                </motion.button>

                <AnimatePresence>
                    {showVolumeSlider && (
                        <motion.div
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            className="absolute bottom-0 right-full mr-2 sm:mr-3 bg-white rounded-xl shadow-soft-xl p-2.5 sm:p-3 border border-neutral-100"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600" />
                                <input
                                    type="range" min="0" max="1" step="0.1" value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-16 sm:w-20 accent-primary-700"
                                />
                                <span className="text-[10px] sm:text-xs text-neutral-600 w-7 sm:w-8">
                                    {Math.round(volume * 100)}%
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}