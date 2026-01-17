'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Heart,
    Trees,
    Bath,
    MapPin,
    Maximize2,
    X,
    Play,
    Pause,
    Grid3X3,
    Layers,
    Sparkles,
    Sun,
    Moon,
    Coffee,
    Bed,
    Book,
    Star,
    PawPrint,
    ArrowRight
} from 'lucide-react'

const VirtualTour = () => {
    const [currentRoom, setCurrentRoom] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [autoPlay, setAutoPlay] = useState(false)
    const [viewMode, setViewMode] = useState<'carousel' | 'grid' | 'stack'>('carousel')
    const [hoveredRoom, setHoveredRoom] = useState<number | null>(null)

    const dragX = useMotionValue(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Simplified room data with only your color palette
    const rooms = [
        {
            id: 1,
            name: "Grand Entrance",
            category: "common",
            image: "/virtual-tour/entrance.jpg",
            description: "Welcoming space for new arrivals",
            features: ["Secure entry", "Guest reception"]
        },
        {
            id: 2,
            name: "Living Room",
            category: "common",
            image: "/virtual-tour/living-room.jpg",
            description: "Comfortable play area with natural light",
            features: ["Play zones", "Cozy corners"]
        },
        {
            id: 3,
            name: "Cat Suite",
            category: "cats",
            image: "/virtual-tour/cat-room.jpg",
            description: "Quiet sanctuary for feline guests",
            features: ["Cat trees", "Window perches"]
        },
        {
            id: 4,
            name: "Cat Play Area",
            category: "cats",
            image: "/virtual-tour/cat-play.jpg",
            description: "Interactive space for curious cats",
            features: ["Climbing towers", "Toys"]
        },
        {
            id: 5,
            name: "Dog Suite",
            category: "dogs",
            image: "/virtual-tour/dog-room.jpg",
            description: "Comfortable rest area for dogs",
            features: ["Individual spaces", "Soft beds"]
        },
        {
            id: 6,
            name: "Dog Activity Zone",
            category: "dogs",
            image: "/virtual-tour/dog-play.jpg",
            description: "Exercise area for energetic pups",
            features: ["Play equipment", "Toys"]
        },
        {
            id: 7,
            name: "Kitchen",
            category: "common",
            image: "/virtual-tour/kitchen.jpg",
            description: "Meal preparation center",
            features: ["Fresh meals", "Special diets"]
        },
        {
            id: 8,
            name: "Garden",
            category: "outdoor",
            image: "/virtual-tour/garden.jpg",
            description: "Secure outdoor playground",
            features: ["Fenced area", "Nature paths"]
        },
        {
            id: 9,
            name: "Spa Room",
            category: "services",
            image: "/virtual-tour/spa.jpg",
            description: "Grooming and wellness center",
            features: ["Grooming", "Spa treatments"]
        },
        {
            id: 10,
            name: "Rest Area",
            category: "services",
            image: "/virtual-tour/quiet-room.jpg",
            description: "Quiet space for relaxation",
            features: ["Calming environment", "Soft music"]
        }
    ]

    const categories = [
        { id: 'all', label: 'Full Tour', icon: PawPrint, count: rooms.length },
        { id: 'cats', label: 'Cat Paradise', icon: Heart, count: rooms.filter(r => r.category === 'cats').length },
        { id: 'dogs', label: 'Dog Haven', icon: Home, count: rooms.filter(r => r.category === 'dogs').length },
        { id: 'outdoor', label: 'Gardens', icon: Trees, count: rooms.filter(r => r.category === 'outdoor').length },
        { id: 'services', label: 'Spa & Wellness', icon: Bath, count: rooms.filter(r => r.category === 'services').length },
        { id: 'common', label: 'Common Areas', icon: Star, count: rooms.filter(r => r.category === 'common').length }
    ]

    const filteredRooms = selectedCategory === 'all'
        ? rooms
        : rooms.filter(room => room.category === selectedCategory)

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (autoPlay && filteredRooms.length > 0) {
            timer = setInterval(() => {
                setCurrentRoom((prev) => {
                    const next = (prev + 1) % filteredRooms.length;
                    return next;
                });
            }, 3500);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [autoPlay, filteredRooms.length]);

    // ESC key to close fullscreen
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        if (isFullscreen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isFullscreen]);

    const handleDragEnd = () => {
        const threshold = 50
        if (dragX.get() > threshold) {
            prevRoom()
        } else if (dragX.get() < -threshold) {
            nextRoom()
        }
        dragX.set(0)
    }

    const nextRoom = () => {
        setCurrentRoom((prev) => (prev + 1) % filteredRooms.length)
        setAutoPlay(false)
    }

    const prevRoom = () => {
        setCurrentRoom((prev) => (prev - 1 + filteredRooms.length) % filteredRooms.length)
        setAutoPlay(false)
    }

    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-white via-primary-50 to-white relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #D4A5A5 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header with SVG Decorations */}
                <motion.div
                    className="mb-12 relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Mobile SVGs */}
                    <div className="flex items-center justify-center gap-14 mb-6 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1.8 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src="/svgs/tour-decoration-left.svg"
                                alt="Tour decoration"
                                width={80}
                                height={80}
                                className="w-16 h-16 sm:w-20 sm:h-20 opacity-70"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1.8 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Image
                                src="/svgs/tour-decoration-right.svg"
                                alt="Tour decoration"
                                width={80}
                                height={80}
                                className="w-16 h-16 sm:w-20 sm:h-20 opacity-70"
                            />
                        </motion.div>
                    </div>

                    {/* Desktop SVGs */}
                    <motion.div
                        className="hidden lg:block absolute top-0 left-0 xl:left-20"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{
                            opacity: 0.7,
                            x: -30,
                            y: [0, 10, 0],
                            scale: 2.2

                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                        }}
                    >
                        <Image
                            src="/svgs/tour-decoration-left.svg"
                            alt="Tour decoration"
                            width={150}
                            height={150}
                            className="w-32 h-32 lg:w-36 lg:h-36"
                        />
                    </motion.div>

                    <motion.div
                        className="hidden lg:block absolute top-0 right-0 xl:right-20"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{
                            opacity: 0.7,
                            x: 30,
                            y: [0, -10, 0],
                            scale: 2.2
                        }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                        }}
                    >
                        <Image
                            src="/svgs/tour-decoration-right.svg"
                            alt="Tour decoration"
                            width={150}
                            height={150}
                            className="w-32 h-32 lg:w-36 lg:h-36"
                        />
                    </motion.div>

                    {/* Title */}
                    <div className="text-center">
                        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                            Virtual Experience
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mt-2 mb-4 text-neutral-900">
                            Tour Our <span className="text-primary-500">Pet Paradise</span>
                        </h2>
                        <p className="text-neutral-600 flex items-center justify-center gap-2 text-base sm:text-lg max-w-2xl mx-auto">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            Explore every corner of our luxury boarding home in Wellesley Hills
                        </p>
                    </div>
                </motion.div>

                {/* View Mode Selector */}
                <div className="flex justify-center gap-3 mb-8">
                    {[
                        { mode: 'carousel', icon: Layers, label: 'Carousel' },
                        { mode: 'grid', icon: Grid3X3, label: 'Gallery' },
                        { mode: 'stack', icon: Sparkles, label: 'Stack View' }
                    ].map(({ mode, icon: Icon, label }) => (
                        <motion.button
                            key={mode}
                            onClick={() => setViewMode(mode as any)}
                            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                                viewMode === mode
                                    ? 'bg-neutral-900 text-white shadow-soft-lg'
                                    : 'bg-white hover:bg-neutral-50 text-neutral-700 shadow-soft border border-neutral-200'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Category Filter */}
                <div className="mb-10 overflow-x-auto scrollbar-hide">
                    <div className="flex justify-start sm:justify-center gap-2 px-4 sm:px-0 pb-2 min-w-max sm:min-w-0 sm:flex-wrap">
                        {categories.map((cat, index) => {
                            const Icon = cat.icon
                            return (
                                <motion.button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectedCategory(cat.id)
                                        setCurrentRoom(0)
                                    }}
                                    className={`group px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all flex-shrink-0 ${
                                        selectedCategory === cat.id
                                            ? 'bg-primary-500 text-white shadow-soft-lg'
                                            : 'bg-white hover:bg-primary-50 text-neutral-700 shadow-soft hover:shadow-soft-md border border-primary-200'
                                    }`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{cat.label}</span>
                                    <span className={`text-[10px] sm:text-xs ${selectedCategory === cat.id ? 'text-white/80' : 'text-neutral-500'}`}>
                                        ({cat.count})
                                    </span>
                                </motion.button>
                            )
                        })}
                    </div>
                    {/* Scroll indicator for mobile */}
                    <div className="sm:hidden flex justify-center mt-2">
                        <div className="flex gap-1">
                            <div className="w-6 h-0.5 bg-primary-300 rounded-full"></div>
                            <div className="w-2 h-0.5 bg-neutral-300 rounded-full"></div>
                            <div className="w-2 h-0.5 bg-neutral-300 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Carousel View - More Refined */}
                {viewMode === 'carousel' && (
                    <motion.div
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Main Display - Smaller and More Elegant */}
                        <div className="bg-white rounded-2xl shadow-soft-xl overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-0">
                                {/* Image Section */}
                                <motion.div
                                    className="relative aspect-[4/3] md:aspect-auto md:h-full group overflow-hidden bg-neutral-100"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.2}
                                    onDragEnd={handleDragEnd}
                                    style={{ x: dragX }}
                                >
                                    <img
                                        src={filteredRooms[currentRoom]?.image}
                                        alt={filteredRooms[currentRoom]?.name}
                                        className="w-full h-full object-cover"
                                        draggable="false"
                                    />

                                    {/* Subtle Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                                    {/* Navigation Buttons */}
                                    <button
                                        onClick={prevRoom}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-soft transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-neutral-700" />
                                    </button>

                                    <button
                                        onClick={nextRoom}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-soft transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="w-5 h-5 text-neutral-700" />
                                    </button>
                                </motion.div>

                                {/* Info Section */}
                                <div className="p-6 md:p-8 bg-gradient-to-br from-primary-50 to-white">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-display font-semibold text-neutral-900 mb-2">
                                                {filteredRooms[currentRoom]?.name}
                                            </h3>
                                            <p className="text-neutral-600">
                                                {filteredRooms[currentRoom]?.description}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-light text-primary-400">
                                                {String(currentRoom + 1).padStart(2, '0')}
                                            </span>
                                            <span className="text-sm text-neutral-500 block">
                                                of {filteredRooms.length}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                                            Features
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {filteredRooms[currentRoom]?.features.map((feature, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 bg-white rounded-full text-sm text-neutral-600 shadow-soft-sm border border-primary-100"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <motion.button
                                            onClick={() => setAutoPlay(!autoPlay)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                                                autoPlay
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-white text-neutral-700 border border-neutral-200'
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            {autoPlay ? 'Pause' : 'Auto Play'}
                                        </motion.button>

                                        <motion.button
                                            onClick={() => setIsFullscreen(true)}
                                            className="px-4 py-2 rounded-full text-sm font-medium bg-white text-neutral-700 border border-neutral-200 flex items-center gap-2"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                            Fullscreen
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="mt-6 bg-white rounded-xl p-4 shadow-soft">
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {filteredRooms.map((room, index) => (
                                    <motion.button
                                        key={room.id}
                                        onClick={() => setCurrentRoom(index)}
                                        className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                                            index === currentRoom
                                                ? 'ring-2 ring-primary-400 scale-105'
                                                : 'hover:ring-2 hover:ring-primary-200'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="w-20 h-16 bg-neutral-100">
                                            <img
                                                src={room.image}
                                                alt={room.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        <span className="absolute bottom-1 left-1 right-1 text-white text-[10px] font-medium truncate">
                                            {room.name}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Grid View - Clean Gallery */}
                {viewMode === 'grid' && (
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {filteredRooms.map((room, index) => (
                            <motion.div
                                key={room.id}
                                className="group relative bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-soft-xl transition-all cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -5 }}
                                onMouseEnter={() => setHoveredRoom(index)}
                                onMouseLeave={() => setHoveredRoom(null)}
                                onClick={() => {
                                    setCurrentRoom(index)
                                    setViewMode('carousel')
                                }}
                            >
                                <div className="aspect-square relative overflow-hidden bg-neutral-100">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform transition-transform duration-300">
                                        <h4 className="font-medium text-sm mb-0.5">{room.name}</h4>
                                        <p className={`text-xs opacity-90 transition-all duration-300 ${
                                            hoveredRoom === index ? 'opacity-100' : 'opacity-0'
                                        }`}>
                                            {room.description}
                                        </p>
                                    </div>

                                    {hoveredRoom === index && (
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <div className="bg-white/90 rounded-full p-3 shadow-lg">
                                                <ArrowRight className="w-5 h-5 text-neutral-700" />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Stack View - Card Stack */}
                {viewMode === 'stack' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="relative h-[500px] flex items-center justify-center">
                            {[0, 1, 2, 3, 4].map((offset) => {
                                const roomIndex = (currentRoom + offset) % filteredRooms.length;
                                const room = filteredRooms[roomIndex];
                                const isActive = offset === 0;
                                const visualOffset = offset * 15;
                                const scale = 1 - (offset * 0.05);
                                const opacity = 1 - (offset * 0.15);

                                return (
                                    <motion.div
                                        key={`${room.id}-${offset}`}
                                        className="absolute bg-white rounded-2xl shadow-soft-xl overflow-hidden cursor-pointer"
                                        style={{
                                            width: '90%',
                                            maxWidth: '600px',
                                            height: '400px',
                                            zIndex: 5 - offset
                                        }}
                                        initial={{
                                            y: visualOffset,
                                            scale: scale,
                                            opacity: opacity
                                        }}
                                        animate={{
                                            y: visualOffset,
                                            scale: scale,
                                            opacity: opacity
                                        }}
                                        whileHover={isActive ? { scale: scale + 0.02 } : {}}
                                        onClick={isActive ? nextRoom : undefined}
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    >
                                        <div className="h-2/3 bg-neutral-100">
                                            <img
                                                src={room.image}
                                                alt={room.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="h-1/3 p-4 bg-gradient-to-r from-primary-50 to-white">
                                            <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                                                {room.name}
                                            </h3>
                                            <p className="text-sm text-neutral-600">
                                                {room.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-neutral-600 mb-3">Click the front card or use arrows to browse</p>
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={prevRoom}
                                    className="p-2 rounded-full bg-white shadow-soft hover:shadow-soft-md transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5 text-neutral-700" />
                                </button>
                                <button
                                    onClick={nextRoom}
                                    className="p-2 rounded-full bg-white shadow-soft hover:shadow-soft-md transition-all"
                                >
                                    <ChevronRight className="w-5 h-5 text-neutral-700" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Indicators */}
                <div className="flex justify-center gap-1.5 mt-8">
                    {filteredRooms.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setCurrentRoom(index)}
                            className={`transition-all rounded-full ${
                                index === currentRoom
                                    ? 'w-8 h-2 bg-primary-500'
                                    : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
                            }`}
                            whileHover={{ scale: 1.2 }}
                        />
                    ))}
                </div>

                {/* Fullscreen Modal */}
                <AnimatePresence>
                    {isFullscreen && (
                        <motion.div
                            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Close Button - More Prominent */}
                            <motion.button
                                onClick={() => setIsFullscreen(false)}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-primary-300 transition-all p-3 bg-black/50 hover:bg-black/70 rounded-full group"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Close fullscreen"
                            >
                                <X className="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-90 transition-transform duration-300" />
                            </motion.button>

                            {/* ESC hint */}
                            <motion.div
                                className="absolute top-4 left-4 text-white/60 text-sm hidden sm:block"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Press ESC to exit
                            </motion.div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={prevRoom}
                                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white hover:text-primary-300 transition-all p-3 bg-black/30 hover:bg-black/50 rounded-full"
                                aria-label="Previous room"
                            >
                                <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
                            </button>

                            {/* Main Image */}
                            <motion.img
                                src={filteredRooms[currentRoom]?.image}
                                alt={filteredRooms[currentRoom]?.name}
                                className="max-w-[90%] max-h-[80%] object-contain rounded-lg"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                onClick={(e) => e.stopPropagation()}
                            />

                            <button
                                onClick={nextRoom}
                                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-white hover:text-primary-300 transition-all p-3 bg-black/30 hover:bg-black/50 rounded-full"
                                aria-label="Next room"
                            >
                                <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
                            </button>

                            {/* Room Info */}
                            <motion.div
                                className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 text-center bg-black/60 backdrop-blur-sm px-6 py-3 rounded-xl"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-white text-xl sm:text-2xl font-light mb-1">
                                    {filteredRooms[currentRoom]?.name}
                                </h3>
                                <p className="text-gray-300 text-sm sm:text-base">
                                    {filteredRooms[currentRoom]?.description}
                                </p>
                            </motion.div>

                            {/* Click outside to close */}
                            <div
                                className="absolute inset-0 -z-10"
                                onClick={() => setIsFullscreen(false)}
                                aria-label="Click to close fullscreen"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}

export default VirtualTour