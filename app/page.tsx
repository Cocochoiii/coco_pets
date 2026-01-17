'use client'

import { useState, useEffect } from 'react'
import HeroSection from '@/components/HeroSection'
import CurrentPets from '@/components/CurrentPets'
import Services from '@/components/Services'
import VirtualTour from '@/components/VirtualTour'
import BookingCalendar from '@/components/BookingCalendar'
import Testimonials from '@/components/Testimonials'
import ServiceArea from '@/components/ServiceArea'
import AboutSection from '@/components/AboutSection'
import Contact from '@/components/Contact'
import LoadingScreen from '@/components/LoadingScreen'
import ScrollProgress from '@/components/ScrollProgress'
import BackgroundMusic from '@/components/BackgroundMusic'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="bg-[#EEE1DB]">
      <ScrollProgress />
      <HeroSection />
      <CurrentPets />
      <Services />
      <VirtualTour />
      <BookingCalendar />
      <Testimonials />
      <ServiceArea />
      <AboutSection />
      <Contact />
      <BackgroundMusic />
    </div>
  )
}
