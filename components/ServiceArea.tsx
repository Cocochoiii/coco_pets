'use client'

import { motion } from 'framer-motion'
import { MapPin, Navigation, Car, Home, Clock, DollarSign, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export default function ServiceArea() {
    const [hoveredArea, setHoveredArea] = useState<string | null>(null)
    const [selectedZone, setSelectedZone] = useState<'10' | '25' | '50'>('10')

    const serviceAreas = [
        { name: 'Boston', distance: '15 miles', popular: true },
        { name: 'Cambridge', distance: '12 miles', popular: true },
        { name: 'Brookline', distance: '8 miles', popular: true },
        { name: 'Newton', distance: '5 miles', popular: true },
        { name: 'Waltham', distance: '10 miles', popular: false },
        { name: 'Lexington', distance: '15 miles', popular: false },
        { name: 'Arlington', distance: '14 miles', popular: false },
        { name: 'Medford', distance: '16 miles', popular: false },
        { name: 'Somerville', distance: '13 miles', popular: true },
        { name: 'Quincy', distance: '18 miles', popular: false },
        { name: 'Dedham', distance: '10 miles', popular: false },
        { name: 'Needham', distance: '7 miles', popular: true },
        { name: 'Natick', distance: '9 miles', popular: false },
        { name: 'Framingham', distance: '12 miles', popular: false },
        { name: 'Weston', distance: '6 miles', popular: false },
        { name: 'Wellesley', distance: '3 miles', popular: true },
        { name: 'Dover', distance: '8 miles', popular: false },
        { name: 'Sherborn', distance: '11 miles', popular: false },
    ]

    return (
        <section id="service-area" className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-neutral-50 to-white">
            <div className="container mx-auto px-4">
                {/* ===== Title + Mobile SVG ===== */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 relative"
                >
                    {/* Mobile SVG：标题上方居中显示 */}
                    <div className="flex items-center justify-center mb-4 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src="/svgs/service-area-hours.svg"
                                alt="Service area decoration"
                                width={150}
                                height={150}
                                className="w-30 h-30 opacity-90"
                            />
                        </motion.div>
                    </div>

                    <span className="text-primary-700 font-semibold text-sm uppercase tracking-wide">
                        Service Area
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mt-2 mb-4 text-neutral-800">
                        Serving Greater Boston
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto">
                        We proudly serve pet families within a 50-mile radius of Wellesley Hills.
                        Convenient pickup and drop-off services available!
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* ===== Map / Radius Visual ===== */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="bg-gradient-to-br from-neutral-100 to-white rounded-3xl p-6 sm:p-8 h-[360px] sm:h-[420px] lg:h-[500px] flex items-center justify-center relative overflow-hidden border-2 border-neutral-200">
                            {/* Subtle pattern overlay */}
                            <div className="absolute inset-0 bg-dot-pattern opacity-[0.03]" />

                            {/* Zone Selector */}
                            <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-soft-lg p-2 border border-neutral-200">
                                <div className="flex gap-1">
                                    {['10', '25', '50'].map((zone) => (
                                        <motion.button
                                            key={zone}
                                            onClick={() => setSelectedZone(zone as any)}
                                            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                                selectedZone === zone
                                                    ? 'bg-primary-700 text-white'
                                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {zone}mi
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Animated Center Point */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute z-10"
                            >
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary-700 rounded-full shadow-soft-lg" />
                                <div className="absolute inset-0 bg-primary-600 rounded-full animate-ping" />
                            </motion.div>

                            {/* Dynamic Radius Circles */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="border-2 border-primary-700/30 rounded-full absolute"
                                    animate={{
                                        width: selectedZone === '10' ? '140px' : selectedZone === '25' ? '220px' : '300px',
                                        height: selectedZone === '10' ? '140px' : selectedZone === '25' ? '220px' : '300px'
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                                <motion.div
                                    className="border-2 border-primary-700/20 rounded-full absolute"
                                    animate={{
                                        width: selectedZone === '10' ? '220px' : selectedZone === '25' ? '300px' : '380px',
                                        height: selectedZone === '10' ? '220px' : selectedZone === '25' ? '300px' : '380px'
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                                <motion.div
                                    className="border-2 border-primary-700/10 rounded-full absolute"
                                    animate={{
                                        width: selectedZone === '10' ? '300px' : selectedZone === '25' ? '380px' : '460px',
                                        height: selectedZone === '10' ? '300px' : selectedZone === '25' ? '380px' : '460px'
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            {/* Center Label */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 sm:mt-12 bg-white rounded-lg shadow-soft-lg border-2 border-primary-700 p-2.5 sm:p-3 z-10"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary-700" />
                                    <div>
                                        <p className="font-bold text-xs sm:text-sm text-neutral-900">
                                            Coco&apos;s Pet Paradise
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-neutral-600">Wellesley Hills, MA</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Info Cards on Map */}
                            <motion.div
                                className="absolute top-8 left-8 bg-white rounded-lg shadow-soft-md border-2 border-neutral-100 p-3 sm:p-4 hover:border-primary-700 transition-all cursor-pointer"
                                whileHover={{ scale: 1.05, rotate: -2 }}
                            >
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary-700 mb-1.5" />
                                <p className="font-bold text-lg sm:text-2xl text-neutral-900">{selectedZone}</p>
                                <p className="text-xs sm:text-sm text-neutral-600">Mile Radius</p>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-8 right-8 bg-white rounded-lg shadow-soft-md border-2 border-neutral-100 p-3 sm:p-4 hover:border-primary-700 transition-all cursor-pointer"
                                whileHover={{ scale: 1.05, rotate: 2 }}
                            >
                                <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary-700 mb-1.5" />
                                <p className="font-bold text-lg sm:text-2xl text-neutral-900">Free</p>
                                <p className="text-xs sm:text-sm text-neutral-600">Pickup (10mi)</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* ===== Areas List + Info Cards ===== */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-white rounded-3xl shadow-soft-xl border-2 border-neutral-100 p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-neutral-900">
                                <Navigation className="text-primary-700" />
                                Areas We Serve
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {serviceAreas.map((area, index) => (
                                    <motion.div
                                        key={area.name}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.02 }}
                                        onMouseEnter={() => setHoveredArea(area.name)}
                                        onMouseLeave={() => setHoveredArea(null)}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer border-2 ${
                                            hoveredArea === area.name
                                                ? 'bg-primary-700 text-white shadow-soft-lg border-primary-800'
                                                : area.popular
                                                    ? 'bg-primary-50 hover:bg-primary-100 border-primary-100'
                                                    : 'bg-neutral-50 hover:bg-neutral-100 border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                className={`w-2 h-2 rounded-full ${
                                                    hoveredArea === area.name
                                                        ? 'bg-white'
                                                        : area.popular
                                                            ? 'bg-primary-700'
                                                            : 'bg-neutral-400'
                                                }`}
                                                animate={
                                                    hoveredArea === area.name
                                                        ? { scale: [1, 1.5, 1] }
                                                        : {}
                                                }
                                                transition={{ duration: 0.5, repeat: Infinity }}
                                            />
                                            <span
                                                className={`font-medium text-xs sm:text-sm ${
                                                    hoveredArea === area.name
                                                        ? 'text-white'
                                                        : 'text-neutral-700'
                                                }`}
                                            >
                                                {area.name}
                                            </span>
                                            {area.popular && hoveredArea !== area.name && (
                                                <motion.span
                                                    className="text-[10px] sm:text-xs bg-primary-700/10 text-primary-700 px-2 py-0.5 rounded-full font-medium"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring' }}
                                                >
                                                    Popular
                                                </motion.span>
                                            )}
                                        </div>
                                        <span
                                            className={`text-[10px] sm:text-xs ${
                                                hoveredArea === area.name
                                                    ? 'text-white/80'
                                                    : 'text-neutral-500'
                                            }`}
                                        >
                                            {area.distance}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Info Cards */}
                            <div className="space-y-4 pt-6 border-t-2 border-neutral-200">
                                <motion.div
                                    className="bg-primary-50 p-4 rounded-xl border-2 border-primary-100 hover:border-primary-700 transition-all cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h4 className="font-semibold mb-2 text-primary-900 flex items-center gap-2 text-sm sm:text-base">
                                        <Car className="w-4 h-4" />
                                        Pickup & Drop-off Service
                                    </h4>
                                    <ul className="text-xs sm:text-sm text-neutral-700 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-3 h-3 text-primary-700" />
                                            Free within 10 miles of Wellesley Hills
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <DollarSign className="w-3 h-3 text-primary-700" />
                                            $10 for 10-25 miles
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <DollarSign className="w-3 h-3 text-primary-700" />
                                            $20 for 25-50 miles
                                        </li>
                                    </ul>
                                </motion.div>

                                <div className="relative">
                                    {/* Desktop: 大号 SVG 在 Service Hours 左侧 */}
                                    <motion.div
                                        className="hidden lg:block absolute bottom-3 -left-28"
                                        initial={{ opacity: 0, x: -400, y: 50, scale: 3.0 }}
                                        whileInView={{ opacity: 1, x: -400, y: 50, scale: 3.0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <Image
                                            src="/svgs/service-area-hours.svg"
                                            alt="Service hours decoration"
                                            width={180}
                                            height={180}
                                            className="w-40 h-40 opacity-95"
                                        />
                                    </motion.div>

                                    {/* ⬇️ 手机端这里的 SVG 已删掉，只保留上面 Title 那个 */}

                                    <motion.div
                                        className="bg-neutral-50 p-4 rounded-xl border-2 border-neutral-200 hover:border-neutral-400 transition-all cursor-pointer"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <h4 className="font-semibold mb-2 text-neutral-900 flex items-center gap-2 text-sm sm:text-base">
                                            <Clock className="w-4 h-4 text-neutral-700" />
                                            Service Hours
                                        </h4>
                                        <ul className="text-xs sm:text-sm text-neutral-700 space-y-1">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-3 h-3 text-neutral-600" />
                                                Drop-off: 7:00 AM - 9:00 AM
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-3 h-3 text-neutral-600" />
                                                Pick-up: 4:00 PM - 7:00 PM
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="w-3 h-3 text-neutral-600" />
                                                Flexible timing available on request
                                            </li>
                                        </ul>
                                    </motion.div>
                                </div>

                                <motion.div
                                    className="bg-gradient-to-br from-primary-700 to-primary-800 p-4 rounded-xl text-white relative overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                                        <MapPin className="w-4 h-4" />
                                        Extended Service
                                    </h4>
                                    <p className="text-xs sm:text-sm text-primary-50">
                                        Special arrangements available for locations beyond 50 miles.
                                        Contact us for custom quotes!
                                    </p>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f3f4f6;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #9ca3af;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d4a5a5;
                }
            `}</style>
        </section>
    )
}
