'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'

interface MusicContextType {
    isPlaying: boolean
    volume: number
    togglePlay: () => void
    setVolume: (volume: number) => void
    audioRef: React.RefObject<HTMLAudioElement>
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export const useMusic = () => {
    const context = useContext(MusicContext)
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider')
    }
    return context
}

export function MusicProvider({ children }: { children: ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.3)
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        // Try to play music after user interaction
        const handleUserInteraction = () => {
            if (!isPlaying && audioRef.current) {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true)
                    })
                    .catch(() => {
                        // Silently fail, user can click play button
                    })
            }
        }

        // Listen for any user interaction
        document.addEventListener('click', handleUserInteraction, { once: true })
        document.addEventListener('touchstart', handleUserInteraction, { once: true })

        // Set initial volume
        if (audioRef.current) {
            audioRef.current.volume = volume
        }

        return () => {
            document.removeEventListener('click', handleUserInteraction)
            document.removeEventListener('touchstart', handleUserInteraction)
        }
    }, [])

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
                setIsPlaying(false)
            } else {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true)
                    })
                    .catch(() => {
                        console.log('Unable to play audio')
                    })
            }
        }
    }

    const handleSetVolume = (newVolume: number) => {
        setVolume(newVolume)
        if (audioRef.current) {
            audioRef.current.volume = newVolume
        }
    }

    return (
        <MusicContext.Provider value={{ isPlaying, volume, togglePlay, setVolume: handleSetVolume, audioRef }}>
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                loop
                preload="auto"
                src="/audio/animal-crossing-bgm.mp3"
            >
                Your browser does not support the audio element.
            </audio>
            {children}
        </MusicContext.Provider>
    )
}