'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
    Cat, Dog, Heart, Star, Calendar, Home, Sparkles, X, ChevronLeft, ChevronRight,
    Camera, Play, Film, PlayCircle, Eye, ArrowUpRight
} from 'lucide-react'
import { currentPets } from '@/data/pets'
import Image from 'next/image'

// 3D Card Component with mouse tracking
const Card3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x, { stiffness: 500, damping: 50 })
    const mouseYSpring = useSpring(y, { stiffness: 500, damping: 50 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg'])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg'])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        x.set(mouseX / width - 0.5)
        y.set(mouseY / height - 0.5)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Spotlight effect that follows cursor
const Spotlight = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
    const divRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [opacity, setOpacity] = useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return
        const rect = divRef.current.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            onClick={onClick}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(212, 165, 165, 0.15), transparent 60%)`,
                }}
            />
            {children}
        </div>
    )
}

// Video mappings
const petVideos: Record<string, string[]> = {
    'cat-1': ['/videos/Bibi.mp4', '/videos/Bibi2.mp4', '/videos/Bibi3.mp4'],
    'cat-2': ['/videos/Dudu.mp4'],
    'cat-3': ['/videos/Fifi.mp4'],
    'cat-4': ['/videos/Meimei.mp4'],
    'cat-5': ['/videos/Neon.mp4'],
    'cat-6': ['/videos/XiaBao.mp4'],
    'cat-7': ['/videos/Mia_cat.mp4'],
    'cat-8': ['/videos/Tutu.mp4'],
    'cat-9': ['/videos/Xianbei.mp4'],
    'cat-10': ['/videos/Chacha.mp4'],
    'cat-11': ['/videos/Yaya.mp4'],
    'cat-12': ['/videos/Ergou.mp4'],
    'cat-13': ['/videos/chouchou.mp4'],
    'cat-14': ['/videos/Xiaojin.mp4'],
    'cat-15': ['/videos/Mituan.mp4'],
    'dog-1': ['/videos/Oscar.mp4'],
    'dog-2': ['/videos/Loki.mp4'],
    'dog-3': ['/videos/Nana.mp4'],
    'dog-4': ['/videos/Richard.mp4'],
    'dog-5': ['/videos/Tata.mp4'],
    'dog-6': ['/videos/Caicai.mp4'],
    'dog-7': ['/videos/Mia_dog.mp4'],
    'dog-8': ['/videos/Nova.mp4'],
    'dog-9': ['/videos/Haha.mp4'],
    'dog-10': ['/videos/Jiujiu.mp4'],
    'dog-11': ['/videos/Toast.mp4'],
    'dog-12': ['/videos/Honey.mp4'],
    'dog-13': ['/videos/Nina.mp4'],
    'dog-14': ['/videos/Marble.mp4'],
    'dog-15': ['/videos/Bobo.mp4'],
    'dog-16': ['/videos/Huhu.mp4'],
    'dog-17': ['/videos/Cooper.mp4']
}

export default function CurrentPets() {
    const [filter, setFilter] = useState<'all' | 'cat' | 'dog'>('all')
    const [selectedPet, setSelectedPet] = useState<typeof currentPets[0] | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({})
    const [mutedVideos, setMutedVideos] = useState<Record<string, boolean>>({})
    const [viewMode, setViewMode] = useState<'grid' | 'magazine'>('grid')
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

    const filteredPets = filter === 'all' ? currentPets : currentPets.filter(pet => pet.type === filter)
    const cats = currentPets.filter(p => p.type === 'cat')
    const dogs = currentPets.filter(p => p.type === 'dog')

    const handleVideoPlay = (petId: string) => {
        const video = videoRefs.current[petId]
        if (video) {
            if (playingVideos[petId]) {
                video.pause()
            } else {
                video.play()
            }
            setPlayingVideos(prev => ({ ...prev, [petId]: !prev[petId] }))
        }
    }

    useEffect(() => {
        const initialMuted: Record<string, boolean> = {}
        filteredPets.forEach(pet => { initialMuted[pet.id] = true })
        setMutedVideos(initialMuted)
    }, [filteredPets])

    return (
        <section id="current-pets" className="py-16 md:py-24 bg-gradient-to-b from-white via-primary-50/30 to-white relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A5A5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />

            <div className="container mx-auto px-4 relative">
                {/* Elegant Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-16"
                >
                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <motion.div
                            className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-primary-300"
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary-400 fill-primary-200" />
                        </motion.div>
                        <motion.div
                            className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-primary-300"
                            initial={{ width: 0 }}
                            whileInView={{ width: 80 }}
                            viewport={{ once: true }}
                        />
                    </div>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-neutral-800">
                        Our <span className="text-gradient">Furry Friends</span>
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
                        Meet the beloved companions who call Coco&apos;s Paradise home.
                        Each receives personalized care and endless affection.
                    </p>

                    {/* Elegant Stats */}
                    <div className="flex justify-center gap-8 md:gap-12 mt-8">
                        <motion.div
                            className="text-center"
                            whileHover={{ y: -3 }}
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center shadow-soft-md border border-primary-100">
                                <Cat className="w-6 h-6 md:w-7 md:h-7 text-primary-600" />
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-neutral-800">{cats.length}</p>
                            <p className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider">Cats</p>
                        </motion.div>
                        <div className="w-px h-20 bg-gradient-to-b from-transparent via-neutral-200 to-transparent" />
                        <motion.div
                            className="text-center"
                            whileHover={{ y: -3 }}
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center shadow-soft-md border border-neutral-100">
                                <Dog className="w-6 h-6 md:w-7 md:h-7 text-neutral-600" />
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-neutral-800">{dogs.length}</p>
                            <p className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider">Dogs</p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Filter & View Toggle */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
                    {/* Filter Pills */}
                    <div className="flex gap-2">
                        {[
                            { value: 'all', label: 'All', icon: Heart },
                            { value: 'cat', label: 'Cats', icon: Cat },
                            { value: 'dog', label: 'Dogs', icon: Dog },
                        ].map((option) => (
                            <motion.button
                                key={option.value}
                                onClick={() => setFilter(option.value as any)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 text-sm ${
                                    filter === option.value
                                        ? 'bg-neutral-900 text-white shadow-lg'
                                        : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:shadow-soft-md'
                                }`}
                            >
                                <option.icon className="w-4 h-4" />
                                <span>{option.label}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                viewMode === 'grid' ? 'bg-white shadow-soft-sm text-neutral-800' : 'text-neutral-500'
                            }`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('magazine')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                viewMode === 'magazine' ? 'bg-white shadow-soft-sm text-neutral-800' : 'text-neutral-500'
                            }`}
                        >
                            Magazine
                        </button>
                    </div>
                </div>

                {/* Pet Grid - Premium Card Design */}
                {viewMode === 'grid' && (
                    <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredPets.map((pet, index) => (
                                <motion.div
                                    key={pet.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.03 }}
                                >
                                    <Card3D className="perspective-1000">
                                        <Spotlight className="group cursor-pointer" onClick={() => setSelectedPet(pet)}>
                                            <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-soft-md hover:shadow-soft-xl transition-all duration-500 border border-neutral-100 hover:border-primary-200">
                                                {/* Image Container */}
                                                <div className="relative aspect-[4/5] overflow-hidden">
                                                    {pet.image ? (
                                                        <Image
                                                            src={pet.image}
                                                            alt={pet.name}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-50">
                                                            {pet.type === 'cat' ? (
                                                                <Cat className="w-16 h-16 text-primary-200" />
                                                            ) : (
                                                                <Dog className="w-16 h-16 text-neutral-300" />
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                    {/* Top Badges */}
                                                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                                                        {pet.status === 'resident' && (
                                                            <motion.div
                                                                initial={{ x: -20, opacity: 0 }}
                                                                animate={{ x: 0, opacity: 1 }}
                                                                className="bg-white/90 backdrop-blur-sm text-neutral-800 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold flex items-center gap-1 shadow-soft-sm"
                                                            >
                                                                <Home className="w-3 h-3" />
                                                                <span className="hidden sm:inline">Resident</span>
                                                            </motion.div>
                                                        )}
                                                        <div className="flex gap-1.5 ml-auto">
                                                            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] md:text-xs flex items-center gap-1 shadow-soft-sm">
                                                                <Camera className="w-3 h-3 text-neutral-600" />
                                                                <span className="text-neutral-700 font-medium">3</span>
                                                            </div>
                                                            {petVideos[pet.id] && (
                                                                <motion.div
                                                                    animate={{ scale: [1, 1.05, 1] }}
                                                                    transition={{ duration: 2, repeat: Infinity }}
                                                                    className="bg-primary-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] md:text-xs flex items-center gap-1 shadow-soft-sm"
                                                                >
                                                                    <Film className="w-3 h-3 text-white" />
                                                                    <span className="text-white font-medium">{petVideos[pet.id].length}</span>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Hover Content */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                                        <div className="flex items-center gap-2 text-white/90 text-xs">
                                                            <Eye className="w-4 h-4" />
                                                            <span>View Gallery</span>
                                                            <ArrowUpRight className="w-3 h-3 ml-auto" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pet Info */}
                                                <div className="p-3 md:p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-sm md:text-base text-neutral-800 truncate group-hover:text-primary-700 transition-colors">
                                                                {pet.name}
                                                            </h3>
                                                            <p className="text-[11px] md:text-xs text-neutral-500 truncate">
                                                                {pet.breed}
                                                            </p>
                                                        </div>
                                                        <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-colors ${
                                                            pet.type === 'cat'
                                                                ? 'bg-primary-50 group-hover:bg-primary-100'
                                                                : 'bg-neutral-50 group-hover:bg-neutral-100'
                                                        }`}>
                                                            {pet.type === 'cat' ? (
                                                                <Cat className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
                                                            ) : (
                                                                <Dog className="w-4 h-4 md:w-5 md:h-5 text-neutral-600" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Single Trait + More */}
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] md:text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full truncate max-w-[100px]">
                                                            {pet.personality[0]}
                                                        </span>
                                                        {pet.personality.length > 1 && (
                                                            <span className="text-[10px] md:text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full font-medium">
                                                                +{pet.personality.length - 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Spotlight>
                                    </Card3D>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Magazine Layout */}
                {viewMode === 'magazine' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Featured Row - Large Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {filteredPets.slice(0, 2).map((pet, index) => (
                                <motion.div
                                    key={pet.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setSelectedPet(pet)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative h-72 md:h-96 rounded-2xl md:rounded-3xl overflow-hidden shadow-soft-lg hover:shadow-soft-xl transition-all duration-500">
                                        {pet.image && (
                                            <Image
                                                src={pet.image}
                                                alt={pet.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    {pet.status === 'resident' && (
                                                        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                                                            <Sparkles className="w-3 h-3 text-yellow-300" />
                                                            <span className="text-white/90 text-xs font-medium">Original Resident</span>
                                                        </div>
                                                    )}
                                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{pet.name}</h3>
                                                    <p className="text-white/70 text-sm md:text-base">{pet.breed}</p>
                                                    <div className="flex gap-2 mt-3">
                                                        {pet.personality.slice(0, 2).map(trait => (
                                                            <span key={trait} className="text-xs px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full">
                                                                {trait}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                                                >
                                                    <ArrowUpRight className="w-5 h-5 text-white" />
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Media badges */}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs flex items-center gap-1">
                                                <Camera className="w-3.5 h-3.5 text-neutral-600" />
                                                <span className="font-medium">3</span>
                                            </div>
                                            {petVideos[pet.id] && (
                                                <div className="bg-primary-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs flex items-center gap-1">
                                                    <Film className="w-3.5 h-3.5 text-white" />
                                                    <span className="text-white font-medium">{petVideos[pet.id].length}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Regular Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                            {filteredPets.slice(2).map((pet, index) => (
                                <motion.div
                                    key={pet.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.03 }}
                                    onClick={() => setSelectedPet(pet)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden shadow-soft-md hover:shadow-soft-lg transition-all duration-500">
                                        {pet.image ? (
                                            <Image
                                                src={pet.image}
                                                alt={pet.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary-50 to-neutral-50 flex items-center justify-center">
                                                {pet.type === 'cat' ? <Cat className="w-10 h-10 text-primary-200" /> : <Dog className="w-10 h-10 text-neutral-300" />}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Hover Info */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <h3 className="text-white font-bold text-sm truncate">{pet.name}</h3>
                                            <p className="text-white/70 text-xs truncate">{pet.breed}</p>
                                        </div>

                                        {/* Video indicator */}
                                        {petVideos[pet.id] && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500/90 rounded-full flex items-center justify-center">
                                                <Play className="w-3 h-3 text-white fill-white" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Premium Modal */}
                <AnimatePresence>
                    {selectedPet && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-8"
                            onClick={() => setSelectedPet(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25 }}
                                className="bg-white rounded-2xl md:rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <motion.button
                                    onClick={() => setSelectedPet(null)}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft-lg z-30 hover:bg-white transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-700" />
                                </motion.button>

                                <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                                    {/* Left - Media Section */}
                                    <div className="lg:w-1/2 bg-gradient-to-br from-neutral-100 to-neutral-50 p-4 md:p-6">
                                        {/* Main Image */}
                                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-soft-lg">
                                            {selectedPet.images && selectedPet.images.length > 0 ? (
                                                <>
                                                    <Image
                                                        src={selectedPet.images[currentImageIndex]}
                                                        alt={selectedPet.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        onClick={() => setCurrentImageIndex(prev => (prev - 1 + 3) % 3)}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-soft-md"
                                                    >
                                                        <ChevronLeft className="w-5 h-5 text-neutral-700" />
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentImageIndex(prev => (prev + 1) % 3)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-soft-md"
                                                    >
                                                        <ChevronRight className="w-5 h-5 text-neutral-700" />
                                                    </button>
                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                        {[0, 1, 2].map(i => (
                                                            <button
                                                                key={i}
                                                                onClick={() => setCurrentImageIndex(i)}
                                                                className={`h-1.5 rounded-full transition-all ${
                                                                    currentImageIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-neutral-100 flex items-center justify-center">
                                                    {selectedPet.type === 'cat' ? <Cat className="w-24 h-24 text-primary-200" /> : <Dog className="w-24 h-24 text-neutral-300" />}
                                                </div>
                                            )}
                                        </div>

                                        {/* Thumbnails + Video */}
                                        <div className="flex gap-2">
                                            {selectedPet.images?.map((img, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentImageIndex(i)}
                                                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                                                        currentImageIndex === i ? 'border-primary-500 shadow-soft-md' : 'border-transparent opacity-70 hover:opacity-100'
                                                    }`}
                                                >
                                                    <Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
                                                </button>
                                            ))}
                                            {petVideos[selectedPet.id] && (
                                                <motion.button
                                                    onClick={() => handleVideoPlay(selectedPet.id)}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="w-16 h-16 rounded-xl overflow-hidden bg-black relative"
                                                >
                                                    <video src={petVideos[selectedPet.id][0]} className="w-full h-full object-cover" muted />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <PlayCircle className="w-6 h-6 text-white" />
                                                    </div>
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right - Info Section */}
                                    <div className="lg:w-1/2 p-6 md:p-8 overflow-y-auto">
                                        {/* Header */}
                                        <div className="mb-6">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">{selectedPet.name}</h2>
                                                    <p className="text-neutral-500">{selectedPet.breed}</p>
                                                </div>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                                    selectedPet.type === 'cat' ? 'bg-primary-100' : 'bg-neutral-100'
                                                }`}>
                                                    {selectedPet.type === 'cat' ? <Cat className="w-6 h-6 text-primary-600" /> : <Dog className="w-6 h-6 text-neutral-600" />}
                                                </div>
                                            </div>
                                            {selectedPet.status === 'resident' && (
                                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-50 to-primary-100 px-3 py-1.5 rounded-full mt-2">
                                                    <Sparkles className="w-4 h-4 text-primary-600" />
                                                    <span className="text-primary-700 text-sm font-medium">Original Resident</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats Row */}
                                        <div className="grid grid-cols-3 gap-3 mb-6">
                                            <div className="bg-neutral-50 rounded-xl p-3 text-center">
                                                <p className="text-lg font-bold text-neutral-800">{selectedPet.age || 'N/A'}</p>
                                                <p className="text-xs text-neutral-500">Age</p>
                                            </div>
                                            <div className="bg-neutral-50 rounded-xl p-3 text-center">
                                                <p className="text-lg font-bold text-neutral-800">3</p>
                                                <p className="text-xs text-neutral-500">Photos</p>
                                            </div>
                                            <div className="bg-neutral-50 rounded-xl p-3 text-center">
                                                <p className="text-lg font-bold text-neutral-800">{petVideos[selectedPet.id]?.length || 0}</p>
                                                <p className="text-xs text-neutral-500">Videos</p>
                                            </div>
                                        </div>

                                        {/* Personality */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                                                <Heart className="w-4 h-4 text-primary-500" />
                                                Personality
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedPet.personality.map(trait => (
                                                    <span key={trait} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                                                        {trait}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Activities */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                Favorite Activities
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedPet.favoriteActivities.map((activity, index) => (
                                                    <div key={index} className="flex items-center gap-2 bg-neutral-50 rounded-lg p-2.5">
                                                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                                                        <span className="text-sm text-neutral-700">{activity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="pt-4 border-t border-neutral-100">
                                            <div className="flex items-center gap-2 text-neutral-500 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                <span>Member since {new Date(selectedPet.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}