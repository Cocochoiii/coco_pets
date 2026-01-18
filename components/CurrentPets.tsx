'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Cat,
    Dog,
    Heart,
    Star,
    Calendar,
    Home,
    Sparkles,
    X,
    ChevronLeft,
    ChevronRight,
    Camera,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize2,
    Film,
    PlayCircle
} from 'lucide-react'
import { currentPets } from '@/data/pets'
import Image from 'next/image'

export default function CurrentPets() {
    const [filter, setFilter] = useState<'all' | 'cat' | 'dog'>('all')
    const [selectedPet, setSelectedPet] = useState<typeof currentPets[0] | null>(null)
    const [hoveredPet, setHoveredPet] = useState<string | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({})
    const [mutedVideos, setMutedVideos] = useState<Record<string, boolean>>({})
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

    const filteredPets = filter === 'all'
        ? currentPets
        : currentPets.filter(pet => pet.type === filter)

    const cats = currentPets.filter(p => p.type === 'cat')
    const dogs = currentPets.filter(p => p.type === 'dog')

    // Video mappings based on pet names and your video files
    const petVideos: Record<string, string[]> = {
        // Cats
        'cat-1': ['/videos/Bibi.mp4', '/videos/Bibi2.mp4', '/videos/Bibi3.mp4'], // Bibi - 3 videos
        'cat-2': ['/videos/Dudu.mp4'], // Dudu
        'cat-3': ['/videos/Fifi.mp4'], // Fifi
        'cat-4': ['/videos/Meimei.mp4'], // Meimei
        'cat-5': ['/videos/Neon.mp4'], // Neon
        'cat-6': ['/videos/XiaBao.mp4'], // Xiabao
        'cat-7': ['/videos/Mia_cat.mp4'], // Mia (cat)
        'cat-8': ['/videos/Tutu.mp4'], // Tutu
        'cat-9': ['/videos/Xianbei.mp4'], // Xianbei
        'cat-10': ['/videos/Chacha.mp4'], // Chacha
        'cat-11': ['/videos/Yaya.mp4'], // Yaya
        'cat-12': ['/videos/Ergou.mp4'], // Er Gou
        'cat-13': ['/videos/chouchou.mp4'], // Chouchou
        'cat-14': ['/videos/Xiaojin.mp4'], // Xiaojin (Golden British Shorthair)
        'cat-15': ['/videos/Mituan.mp4'], // Mituan (British Shorthair Lilac Golden)
        // Dogs
        'dog-1': ['/videos/Oscar.mp4'], // Oscar
        'dog-2': ['/videos/Loki.mp4'], // Loki
        'dog-3': ['/videos/Nana.mp4'], // Nana
        'dog-4': ['/videos/Richard.mp4'], // Richard
        'dog-5': ['/videos/Tata.mp4'], // Tata
        'dog-6': ['/videos/Caicai.mp4'], // Caicai
        'dog-7': ['/videos/Mia_dog.mp4'], // Mia (dog)
        'dog-8': ['/videos/Nova.mp4'], // Nova
        'dog-9': ['/videos/Haha.mp4'], // Haha (Samoyed)
        'dog-10': ['/videos/Jiujiu.mp4'], // Jiujiu (Samoyed)
        'dog-11': ['/videos/Toast.mp4'], // Toast (Standard Poodle)
        'dog-12': ['/videos/Honey.mp4'], // Honey (Labrador Retriever)
        'dog-13': ['/videos/Nina.mp4'], // Nina (Siberian Husky)
        'dog-14': ['/videos/Marble.mp4'], // Marble (Whippet)
        'dog-15': ['/videos/Bobo.mp4'], // Bobo (Long-haired Miniature Dachshund)
        'dog-16': ['/videos/Huhu.mp4'], // Huhu (Golden Retriever)
        'dog-17': ['/videos/Cooper.mp4'] // Huhu (Golden Retriever)
    }

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

    const handleVideoMute = (petId: string) => {
        const video = videoRefs.current[petId]
        if (video) {
            video.muted = !mutedVideos[petId]
            setMutedVideos(prev => ({ ...prev, [petId]: !prev[petId] }))
        }
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % 3)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + 3) % 3)
    }

    const openPetModal = (pet: typeof currentPets[0]) => {
        setSelectedPet(pet)
        setCurrentImageIndex(0)
    }

    useEffect(() => {
        // Initialize all videos as muted
        const initialMuted: Record<string, boolean> = {}
        filteredPets.forEach(pet => {
            initialMuted[pet.id] = true
        })
        setMutedVideos(initialMuted)
    }, [filteredPets])

    return (
        <section id="current-pets" className="py-20 bg-gradient-to-b from-white to-neutral-50">
            <div className="container mx-auto px-4">
                {/* ========= Title + Left/Right SVG ========= */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-12 relative"
                >
                    {/* 🌟 Mobile SVG：标题上方的小图，桌面端隐藏 */}
                    <div className="flex items-center justify-center gap-10 mb-3 lg:hidden">
                        <Image
                            src="/svgs/current-pets-left.svg"
                            alt="Current pets decoration left"
                            width={100}
                            height={100}
                            className="w-25 h-25 opacity-90"
                            priority
                        />
                        <Image
                            src="/svgs/current-pets-right.svg"
                            alt="Current pets decoration right"
                            width={100}
                            height={100}
                            className="w-25 h-25 opacity-90"
                            priority
                        />
                    </div>

                    {/* LEFT SVG - 桌面端左右两侧 - 调小尺寸 */}
                    <motion.div
                        className="hidden lg:block absolute top-4 left-0"
                        initial={{ opacity: 0, x: -50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        whileInView={{
                            opacity: 1,
                            x: -10,
                            scale: 1.3,
                            y: [0, -20, 0],
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            },
                        }}
                    >
                        <Image
                            src="/svgs/current-pets-left.svg"
                            alt="Current pets decoration left"
                            width={150}
                            height={150}
                            className="w-28 h-28 lg:w-36 lg:h-36 xl:w-40 xl:h-40 opacity-90"
                            priority
                        />
                    </motion.div>

                    {/* RIGHT SVG - 桌面端 - 调小尺寸 */}
                    <motion.div
                        className="hidden lg:block absolute top-4 right-0"
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        whileInView={{
                            opacity: 1,
                            x: 10,
                            scale: 1.3,
                            y: [0, -20, 0],
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            },
                        }}
                    >
                        <Image
                            src="/svgs/current-pets-right.svg"
                            alt="Current pets decoration right"
                            width={150}
                            height={150}
                            className="w-28 h-28 lg:w-36 lg:h-36 xl:w-40 xl:h-40 opacity-90"
                            priority
                        />
                    </motion.div>

                    {/* 标题 + 文案 + stats */}
                    <div className="text-center">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-4 text-neutral-900">
                            Our <span className="text-gradient"> Furry Friends Gallery</span>
                        </h2>
                        <p className="text-sm md:text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto">
                            Meet the adorable pets who have enjoyed their stay at Coco&apos;s Paradise.
                            Each one receives personalized care and endless love!
                        </p>

                        {/* Stats */}
                        <div className="flex justify-center gap-4 md:gap-8 mt-6 md:mt-8">
                            <motion.div
                                className="flex items-center gap-2 bg-white border-2 border-primary-700 px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-soft-md text-sm md:text-base"
                                whileHover={{ scale: 1.05, shadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            >
                                <Cat className="w-5 h-5 md:w-6 md:h-6 text-primary-700" />
                                <span className="font-bold text-neutral-900">{cats.length} Cats</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-2 bg-white border-2 border-neutral-700 px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-soft-md text-sm md:text-base"
                                whileHover={{ scale: 1.05, shadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            >
                                <Dog className="w-5 h-5 md:w-6 md:h-6 text-neutral-700" />
                                <span className="font-bold text-neutral-900">{dogs.length} Dogs</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Filter Pills */}
                <div className="flex justify-center gap-3 md:gap-4 mb-10 md:mb-12">
                    {[
                        { value: 'all', label: 'All Pets', icon: Heart },
                        { value: 'cat', label: 'Cats', icon: Cat },
                        { value: 'dog', label: 'Dogs', icon: Dog },
                    ].map((option) => (
                        <motion.button
                            key={option.value}
                            onClick={() => setFilter(option.value as any)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 relative overflow-hidden text-sm md:text-base ${
                                filter === option.value
                                    ? 'bg-neutral-900 text-white shadow-soft-lg'
                                    : 'bg-white text-neutral-700 border-2 border-neutral-200 hover:border-neutral-400 hover:shadow-soft-md'
                            }`}
                        >
                            <option.icon className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
                            <span className="relative z-10">{option.label}</span>
                            {filter === option.value && (
                                <motion.div
                                    className="absolute inset-0 bg-primary-700"
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Pet Grid：手机 2 列，小平板 3 列，桌面 4 列 */}
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPets.map((pet, index) => (
                            <motion.div
                                key={pet.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="relative group"
                            >
                                <motion.div
                                    className="bg-white rounded-xl sm:rounded-2xl shadow-soft-md border-2 border-transparent overflow-hidden hover:border-primary-700 hover:shadow-soft-xl transition-all duration-300"
                                    whileHover={{ y: -5 }}
                                >
                                    {/* Status Badge */}
                                    {pet.status === 'resident' && (
                                        <motion.div
                                            className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 bg-neutral-900 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: 'spring' }}
                                        >
                                            <Home className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            <span className="hidden sm:inline">Resident</span>
                                            <span className="sm:hidden">Home</span>
                                        </motion.div>
                                    )}

                                    {/* Main Image Section */}
                                    <div
                                        className="aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 relative overflow-hidden cursor-pointer"
                                        onClick={() => openPetModal(pet)}
                                        onMouseEnter={() => setHoveredPet(pet.id)}
                                        onMouseLeave={() => setHoveredPet(null)}
                                    >
                                        <div className="absolute inset-0">
                                            {pet.image && pet.image !== '' ? (
                                                <Image
                                                    src={pet.image}
                                                    alt={pet.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-100">
                                                    {pet.type === 'cat' ? (
                                                        <Cat className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-primary-200" />
                                                    ) : (
                                                        <Dog className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-neutral-300" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Photo/Video Count Badges - Smaller on mobile */}
                                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex gap-1 sm:gap-1.5">
                                            <div className="bg-black/60 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-xs flex items-center gap-0.5 sm:gap-1">
                                                <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                <span>3</span>
                                            </div>
                                            {petVideos[pet.id] && (
                                                <motion.div
                                                    className="bg-primary-700/90 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-xs flex items-center gap-0.5 sm:gap-1"
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    <span>{petVideos[pet.id].length}</span>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Hover Overlay */}
                                        <AnimatePresence>
                                            {hoveredPet === pet.id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/20 to-transparent flex items-end p-2 sm:p-3 lg:p-4"
                                                >
                                                    <div className="text-white">
                                                        <p className="text-[10px] sm:text-xs lg:text-sm font-medium flex items-center gap-1 sm:gap-2">
                                                            <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            Click to see more
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Pet Info - Compact on mobile */}
                                    <div className="p-2.5 sm:p-3 lg:p-5">
                                        <div className="flex items-start justify-between mb-1.5 sm:mb-2 lg:mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-xs sm:text-sm lg:text-lg text-neutral-900 truncate">
                                                    {pet.name}
                                                </h3>
                                                <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-500 truncate">
                                                    {pet.breed}
                                                </p>
                                                {pet.age && (
                                                    <p className="text-[9px] sm:text-[10px] lg:text-xs text-neutral-400 mt-0.5 sm:mt-1">
                                                        {pet.age}
                                                    </p>
                                                )}
                                            </div>
                                            <motion.div
                                                animate={{ scale: hoveredPet === pet.id ? 1.2 : 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex-shrink-0 ml-1"
                                            >
                                                {pet.type === 'cat' ? (
                                                    <Cat className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-700" />
                                                ) : (
                                                    <Dog className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-neutral-700" />
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Personality Tags - Show only 1 on mobile, 2 on larger */}
                                        <div className="flex flex-wrap gap-1">
                                            {pet.personality.slice(0, 1).map((trait) => (
                                                <span
                                                    key={trait}
                                                    className="text-[9px] sm:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-neutral-100 text-neutral-600 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors truncate max-w-[80px] sm:max-w-none"
                                                >
                                                    {trait}
                                                </span>
                                            ))}
                                            {pet.personality.length > 1 && (
                                                <span className="text-[9px] sm:text-[10px] lg:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                                                    +{pet.personality.length - 1}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Modal - 电影院风格设计 */}
                <AnimatePresence>
                    {selectedPet && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-neutral-900/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedPet(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                                className="bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-white/10"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <motion.button
                                    onClick={() => setSelectedPet(null)}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-soft-md hover:bg-white/20 transition-all z-30"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </motion.button>

                                {/* Cinema-Style Media Viewer */}
                                <div className="relative">
                                    {/* Pet Name Header - Floating */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                                                    {selectedPet.type === 'cat' ? (
                                                        <Cat className="w-6 h-6 text-white" />
                                                    ) : (
                                                        <Dog className="w-6 h-6 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{selectedPet.name}</h3>
                                                    <p className="text-white/70 text-sm">{selectedPet.breed}</p>
                                                </div>
                                            </div>
                                            {selectedPet.status === 'resident' && (
                                                <div className="mt-3 flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1.5 rounded-full">
                                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-yellow-200 text-xs font-medium">Original Resident</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Main Cinema Screen */}
                                    <div className="relative h-[60vh] bg-black">
                                        {/* Film Strip Decoration */}
                                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black via-neutral-800 to-transparent opacity-60 pointer-events-none">
                                            <div className="h-full flex flex-col justify-evenly py-4">
                                                {[...Array(8)].map((_, i) => (
                                                    <div key={i} className="w-4 h-6 bg-white/10 rounded-sm mx-auto" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black via-neutral-800 to-transparent opacity-60 pointer-events-none">
                                            <div className="h-full flex flex-col justify-evenly py-4">
                                                {[...Array(8)].map((_, i) => (
                                                    <div key={i} className="w-4 h-6 bg-white/10 rounded-sm mx-auto" />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Main Content Area - Split View */}
                                        <div className="h-full flex items-center justify-center px-12">
                                            <div className="flex gap-6 items-center justify-center max-w-5xl w-full">
                                                {/* Photo Showcase */}
                                                <motion.div
                                                    className="flex-1 relative h-[50vh]"
                                                    initial={{ opacity: 0, x: -30 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                                        {selectedPet.images && selectedPet.images.length > 0 ? (
                                                            <>
                                                                <Image
                                                                    src={selectedPet.images[currentImageIndex]}
                                                                    alt={`${selectedPet.name}`}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                                                                {/* Photo Navigation */}
                                                                <button
                                                                    onClick={prevImage}
                                                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                                                >
                                                                    <ChevronLeft className="w-5 h-5 text-white" />
                                                                </button>
                                                                <button
                                                                    onClick={nextImage}
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                                                >
                                                                    <ChevronRight className="w-5 h-5 text-white" />
                                                                </button>

                                                                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                                                                    <Camera className="w-4 h-4 text-white" />
                                                                    <span className="text-white text-xs">Photo {currentImageIndex + 1}/3</span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-800 to-neutral-900">
                                                                <Camera className="w-16 h-16 text-neutral-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>

                                                {/* Vertical Video Player - Portrait Style */}
                                                {petVideos[selectedPet.id] && (
                                                    <motion.div
                                                        className="relative h-[50vh] w-[28vh]"
                                                        initial={{ opacity: 0, x: 30 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.4 }}
                                                    >
                                                        <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                                            {/* Phone Frame Effect */}
                                                            <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-black p-1">
                                                                <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                                                                    <video
                                                                        ref={(el) => { videoRefs.current[selectedPet.id] = el }}
                                                                        src={petVideos[selectedPet.id][0]}
                                                                        className="absolute inset-0 w-full h-full object-cover"
                                                                        muted={mutedVideos[selectedPet.id] ?? true}
                                                                        loop
                                                                        playsInline
                                                                        autoPlay={playingVideos[selectedPet.id]}
                                                                    />

                                                                    {/* Video Overlay */}
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                                                                    {/* Top Status Bar (Phone Style) */}
                                                                    <div className="absolute top-0 left-0 right-0 h-8 bg-black/50 backdrop-blur-sm flex items-center justify-between px-3">
                                                                        <div className="flex items-center gap-1">
                                                                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                                                                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                                                                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                                                                        </div>
                                                                        <span className="text-white/60 text-[10px] font-medium">LIVE</span>
                                                                        <Film className="w-3 h-3 text-white/60" />
                                                                    </div>

                                                                    {/* Center Play Button */}
                                                                    <motion.button
                                                                        onClick={() => handleVideoPlay(selectedPet.id)}
                                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        {playingVideos[selectedPet.id] ? (
                                                                            <Pause className="w-6 h-6 text-white" />
                                                                        ) : (
                                                                            <Play className="w-6 h-6 text-white ml-0.5" />
                                                                        )}
                                                                    </motion.button>

                                                                    {/* Bottom Controls */}
                                                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                                                        <div className="bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-white/10">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <span className="text-white text-xs font-medium">{selectedPet.name} TV</span>
                                                                                <motion.button
                                                                                    onClick={() => handleVideoMute(selectedPet.id)}
                                                                                    className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
                                                                                    whileHover={{ scale: 1.1 }}
                                                                                >
                                                                                    {mutedVideos[selectedPet.id] ? (
                                                                                        <VolumeX className="w-3 h-3 text-white" />
                                                                                    ) : (
                                                                                        <Volume2 className="w-3 h-3 text-white" />
                                                                                    )}
                                                                                </motion.button>
                                                                            </div>
                                                                            {petVideos[selectedPet.id].length > 1 && (
                                                                                <div className="flex items-center gap-1 justify-center">
                                                                                    {petVideos[selectedPet.id].map((_, idx) => (
                                                                                        <div
                                                                                            key={idx}
                                                                                            className={`h-1 rounded-full transition-all ${
                                                                                                idx === 0
                                                                                                    ? 'w-6 bg-primary-500'
                                                                                                    : 'w-2 bg-white/30'
                                                                                            }`}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Film Reel Effect at Bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black to-transparent" />
                                    </div>

                                    {/* Bottom Info Panel */}
                                    <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 border-t border-white/10">
                                        <div className="max-w-5xl mx-auto">
                                            {/* Quick Stats Bar */}
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <motion.div
                                                        className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                                    </motion.div>
                                                    <div>
                                                        <p className="text-white/60 text-xs uppercase tracking-wide">Status</p>
                                                        <p className="text-white font-semibold">Star Guest</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        Since {new Date(selectedPet.joinedDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Personality & Activities Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Personality */}
                                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                                    <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                                                        <Heart className="w-4 h-4 text-primary-400" />
                                                        Personality
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedPet.personality.map((trait) => (
                                                            <span
                                                                key={trait}
                                                                className="px-3 py-1.5 bg-primary-500/20 text-primary-200 rounded-lg text-xs font-medium border border-primary-500/30"
                                                            >
                                                                {trait}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Activities */}
                                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                                    <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-yellow-400" />
                                                        Favorite Activities
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedPet.favoriteActivities.slice(0, 3).map((activity) => (
                                                            <span
                                                                key={activity}
                                                                className="px-3 py-1.5 bg-yellow-500/20 text-yellow-200 rounded-lg text-xs font-medium border border-yellow-500/30"
                                                            >
                                                                {activity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {selectedPet && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedPet(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Enhanced Gallery Header with Video */}
                                <div className="relative">
                                    <motion.button
                                        onClick={() => setSelectedPet(null)}
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-soft-md hover:shadow-soft-lg transition-shadow z-30"
                                    >
                                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" />
                                    </motion.button>

                                    {/* Media Gallery Section - Photos and Videos */}
                                    <div className="bg-gradient-to-br from-primary-50 to-neutral-50 p-6 sm:p-8">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Photo Carousel Section */}
                                            <div className="flex-1">
                                                <div className="relative h-72 sm:h-96 bg-white rounded-2xl overflow-hidden shadow-soft-lg">
                                                    {selectedPet.images && selectedPet.images.length > 0 ? (
                                                        <>
                                                            <div className="absolute inset-0">
                                                                <Image
                                                                    src={selectedPet.images[currentImageIndex]}
                                                                    alt={`${selectedPet.name} - Photo ${currentImageIndex + 1}`}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>

                                                            <button
                                                                onClick={prevImage}
                                                                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-soft-lg hover:bg-white transition-all"
                                                            >
                                                                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700" />
                                                            </button>
                                                            <button
                                                                onClick={nextImage}
                                                                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-soft-lg hover:bg-white transition-all"
                                                            >
                                                                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700" />
                                                            </button>

                                                            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                                                                {[0, 1, 2].map((index) => (
                                                                    <button
                                                                        key={index}
                                                                        onClick={() => setCurrentImageIndex(index)}
                                                                        className={`rounded-full transition-all ${
                                                                            currentImageIndex === index
                                                                                ? 'w-6 sm:w-8 h-2 bg-white'
                                                                                : 'w-2 h-2 bg-white/60 hover:bg-white/80'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>

                                                            {/* Photo Label */}
                                                            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                                                <Camera className="w-4 h-4 text-white" />
                                                                <span className="text-white text-xs font-medium">Photos</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="text-center">
                                                                {selectedPet.type === 'cat' ? (
                                                                    <Cat className="w-24 h-24 sm:w-32 sm:h-32 text-primary-300 mx-auto mb-4" />
                                                                ) : (
                                                                    <Dog className="w-24 h-24 sm:w-32 sm:h-32 text-neutral-400 mx-auto mb-4" />
                                                                )}
                                                                <p className="text-neutral-500">Photos coming soon!</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Video Section - Vertical 9:16 */}
                                            {petVideos[selectedPet.id] && (
                                                <div className="w-full lg:w-auto">
                                                    <div className="relative h-72 sm:h-96 w-full lg:w-56 xl:w-64 bg-black rounded-2xl overflow-hidden shadow-soft-lg mx-auto">
                                                        <video
                                                            ref={(el) => { videoRefs.current[selectedPet.id] = el }}
                                                            src={petVideos[selectedPet.id][0]}
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                            muted={mutedVideos[selectedPet.id] ?? true}
                                                            loop
                                                            playsInline
                                                            autoPlay={playingVideos[selectedPet.id]}
                                                        />

                                                        {/* Video Overlay Controls */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                                                        {/* Video Label */}
                                                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                                                            <Film className="w-4 h-4 text-white" />
                                                            <span className="text-white text-xs font-medium">
                                                                {petVideos[selectedPet.id].length > 1
                                                                    ? `${petVideos[selectedPet.id].length} Videos`
                                                                    : 'Video'}
                                                            </span>
                                                        </div>

                                                        {/* Center Play Button */}
                                                        <motion.button
                                                            onClick={() => handleVideoPlay(selectedPet.id)}
                                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all group"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            {playingVideos[selectedPet.id] ? (
                                                                <Pause className="w-8 h-8 text-white" />
                                                            ) : (
                                                                <Play className="w-8 h-8 text-white ml-1" />
                                                            )}
                                                        </motion.button>

                                                        {/* Bottom Control Bar */}
                                                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                                                            <motion.button
                                                                onClick={() => handleVideoMute(selectedPet.id)}
                                                                className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                {mutedVideos[selectedPet.id] ? (
                                                                    <VolumeX className="w-4 h-4" />
                                                                ) : (
                                                                    <Volume2 className="w-4 h-4" />
                                                                )}
                                                            </motion.button>

                                                            {/* Multiple videos indicator */}
                                                            {petVideos[selectedPet.id].length > 1 && (
                                                                <div className="flex items-center gap-1">
                                                                    {petVideos[selectedPet.id].map((_, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                                                                                idx === 0
                                                                                    ? 'bg-white w-4'
                                                                                    : 'bg-white/40 hover:bg-white/60'
                                                                            }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Pet Name on Video */}
                                                        <div className="absolute bottom-14 left-3 right-3">
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.3 }}
                                                                className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20"
                                                            >
                                                                <p className="text-white text-sm font-semibold">{selectedPet.name}'s Day</p>
                                                                <p className="text-white/80 text-xs">at Coco's Paradise</p>
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Thumbnail Strip for both Photos and Video */}
                                        <div className="mt-4 flex gap-2 justify-center">
                                            {/* Photo Thumbnails */}
                                            {selectedPet.images && selectedPet.images.map((image, index) => (
                                                <button
                                                    key={`photo-${index}`}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                        currentImageIndex === index
                                                            ? 'border-primary-700 shadow-soft-md'
                                                            : 'border-neutral-200 hover:border-neutral-400'
                                                    }`}
                                                >
                                                    <Image
                                                        src={image}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </button>
                                            ))}

                                            {/* Video Thumbnail */}
                                            {petVideos[selectedPet.id] && (
                                                <motion.div
                                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-primary-300 bg-black relative cursor-pointer shadow-soft-md"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleVideoPlay(selectedPet.id)}
                                                >
                                                    <video
                                                        src={petVideos[selectedPet.id][0]}
                                                        className="object-cover w-full h-full"
                                                        muted
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <PlayCircle className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="absolute top-1 right-1 bg-primary-700 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                        {petVideos[selectedPet.id].length}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedPet.status === 'resident' && (
                                        <div className="absolute top-4 left-4 bg-neutral-900 text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 z-20">
                                            <Sparkles className="w-4 h-4" />
                                            Original Resident
                                        </div>
                                    )}
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3">
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                                                {selectedPet.name}
                                            </h3>
                                            <p className="text-base sm:text-lg text-neutral-600">
                                                {selectedPet.breed}
                                            </p>
                                            {selectedPet.age && (
                                                <p className="text-sm text-neutral-500 mt-1">
                                                    Age: {selectedPet.age}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 bg-primary-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-primary-200">
                                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary-700 fill-primary-700" />
                                            <span className="font-semibold text-primary-900 text-xs sm:text-sm">
                                                Star Guest
                                            </span>
                                        </div>
                                    </div>

                                    {/* Personality */}
                                    <div className="mb-5 sm:mb-6">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-neutral-900">
                                            <Heart className="w-5 h-5 text-primary-700" />
                                            Personality Traits
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPet.personality.map((trait) => (
                                                <motion.span
                                                    key={trait}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-3 sm:px-4 py-1.5 bg-neutral-100 text-neutral-700 rounded-full font-medium text-xs sm:text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-default"
                                                >
                                                    {trait}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Favorite Activities */}
                                    <div className="mb-5 sm:mb-6">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-neutral-900">
                                            <Sparkles className="w-5 h-5 text-primary-700" />
                                            Favorite Activities
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {selectedPet.favoriteActivities.map((activity, idx) => (
                                                <motion.div
                                                    key={activity}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg hover:bg-primary-50 transition-colors"
                                                >
                                                    <div className="w-2 h-2 bg-primary-700 rounded-full" />
                                                    <span className="text-neutral-700 text-sm">
                                                        {activity}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Member Since */}
                                    <div className="flex items-center gap-2 text-neutral-500">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs sm:text-sm">
                                            Member since{' '}
                                            {new Date(selectedPet.joinedDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
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