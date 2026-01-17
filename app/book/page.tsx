'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Cat,
  Dog,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  CreditCard,
  Shield,
  Star,
  AlertCircle,
  PawPrint,
  Sun
} from 'lucide-react'
import Link from 'next/link'

type ServiceType = 'cat-boarding' | 'dog-boarding' | 'dog-daycare'
type PetInfo = {
  name: string
  type: 'cat' | 'dog'
  breed: string
  age: string
  weight: string
  specialNeeds: string
  vaccinated: boolean
  neutered: boolean
}

const SERVICES = {
  'cat-boarding': {
    name: 'Cat Boarding',
    icon: Cat,
    price: 25,
    unit: 'night',
    description: 'Cozy home environment with our resident cats Bibi & Dudu',
    features: ['24/7 Care', 'Play Sessions', 'Daily Updates', 'Medication Admin']
  },
  'dog-boarding': {
    name: 'Dog Boarding',
    icon: Dog,
    price: 40,
    priceRange: '$40-60',
    unit: 'night',
    description: 'Loving home care with yard access and daily walks',
    features: ['Daily Walks', 'Playtime', 'Feeding Schedule', 'Photo Updates']
  },
  'dog-daycare': {
    name: 'Dog Daycare',
    icon: Sun,
    price: 25,
    priceRange: '$25-30',
    unit: 'day',
    description: 'Full day care from 7AM-5PM with activities',
    features: ['Supervised Play', 'Rest Time', 'Snacks Included', 'Flexible Hours']
  }
}

export default function BookingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [serviceType, setServiceType] = useState<ServiceType | null>(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [pets, setPets] = useState<PetInfo[]>([{
    name: '', type: 'cat', breed: '', age: '', weight: '',
    specialNeeds: '', vaccinated: false, neutered: false
  }])
  const [specialRequests, setSpecialRequests] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        setIsLoggedIn(data.success)
      } catch { setIsLoggedIn(false) }
    }
    checkAuth()
  }, [])

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const diff = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  const calculateTotal = () => {
    if (!serviceType) return 0
    const nights = serviceType === 'dog-daycare' ? 1 : calculateNights()
    const basePrice = SERVICES[serviceType].price
    const petCount = pets.filter(p => p.name).length || 1
    let total = basePrice * nights * petCount
    if (petCount > 1) total = total * 0.9
    if (nights >= 7) total = total * 0.95
    return total
  }

  const addPet = () => {
    if (pets.length < 3) {
      setPets([...pets, {
        name: '', type: serviceType === 'cat-boarding' ? 'cat' : 'dog',
        breed: '', age: '', weight: '', specialNeeds: '', vaccinated: false, neutered: false
      }])
    }
  }

  const removePet = (index: number) => {
    if (pets.length > 1) setPets(pets.filter((_, i) => i !== index))
  }

  const updatePet = (index: number, field: keyof PetInfo, value: any) => {
    const updated = [...pets]
    updated[index] = { ...updated[index], [field]: value }
    setPets(updated)
  }

  const handleCheckout = async () => {
    if (!isLoggedIn) { router.push('/login?redirect=/book'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/booking/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          booking: {
            serviceType: serviceType?.replace('-', '_'),
            petType: serviceType === 'cat-boarding' ? 'cat' : 'dog',
            checkInDate: checkIn,
            checkOutDate: checkOut || checkIn,
            pets: pets.filter(p => p.name),
            specialRequests,
            totalPrice: calculateTotal(),
            nights: calculateNights() || 1
          }
        })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.error || 'Payment setup failed')
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    } finally { setLoading(false) }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return serviceType !== null
      case 2: return checkIn && (serviceType === 'dog-daycare' || (checkOut && new Date(checkOut) > new Date(checkIn)))
      case 3: return pets.some(p => p.name && p.breed)
      case 4: return agreedToTerms
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEE1DB] to-white py-8 pt-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">Book Your Pet&apos;s Stay</h1>
          <p className="text-neutral-600">Premium home boarding in Wellesley Hills</p>
        </motion.div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 md:gap-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? 'bg-primary-700 text-white' : 'bg-neutral-200 text-neutral-500'}`}
                  whileHover={{ scale: 1.1 }}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </motion.div>
                {s < 4 && <div className={`w-8 md:w-16 h-1 mx-1 rounded ${step > s ? 'bg-primary-700' : 'bg-neutral-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between max-w-md mx-auto mb-8 text-xs md:text-sm text-neutral-500">
          <span className={step >= 1 ? 'text-primary-700 font-medium' : ''}>Service</span>
          <span className={step >= 2 ? 'text-primary-700 font-medium' : ''}>Dates</span>
          <span className={step >= 3 ? 'text-primary-700 font-medium' : ''}>Pet Info</span>
          <span className={step >= 4 ? 'text-primary-700 font-medium' : ''}>Confirm</span>
        </div>

        <motion.div className="bg-white rounded-3xl shadow-xl p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Choose Your Service</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(SERVICES).map(([key, service]) => {
                    const Icon = service.icon
                    const isSelected = serviceType === key
                    return (
                      <motion.button
                        key={key}
                        onClick={() => setServiceType(key as ServiceType)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-primary-700 bg-primary-50' : 'border-neutral-200 hover:border-primary-300'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isSelected ? 'bg-primary-700 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                        <p className="text-2xl font-bold text-primary-700 mb-2">
                          {service.priceRange || `$${service.price}`}
                          <span className="text-sm font-normal text-neutral-500">/{service.unit}</span>
                        </p>
                        <p className="text-sm text-neutral-600 mb-3">{service.description}</p>
                        <div className="space-y-1">
                          {service.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-neutral-500">
                              <CheckCircle className="w-3 h-3 text-green-500" /> {f}
                            </div>
                          ))}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Select Your Dates</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      {serviceType === 'dog-daycare' ? 'Date' : 'Check-in Date'}
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0"
                    />
                  </div>
                  {serviceType !== 'dog-daycare' && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" /> Check-out Date
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-0"
                      />
                    </div>
                  )}
                </div>
                {serviceType === 'dog-daycare' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Daycare Hours</p>
                        <p className="text-sm text-blue-700">Drop-off: 7:00 AM - 9:00 AM | Pick-up: 4:00 PM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                )}
                {checkIn && checkOut && serviceType !== 'dog-daycare' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-primary-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700">Duration</span>
                      <span className="font-bold text-primary-700">{calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">Pet Information</h2>
                  {pets.length < 3 && (
                    <motion.button onClick={addPet} className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Plus className="w-4 h-4" /> Add Pet
                    </motion.button>
                  )}
                </div>
                <div className="space-y-6">
                  {pets.map((pet, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 border-2 border-neutral-200 rounded-2xl relative">
                      {pets.length > 1 && (
                        <button onClick={() => removePet(index)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500">
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <PawPrint className="w-5 h-5 text-primary-600" /> Pet {index + 1}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Pet Name *</label>
                          <input type="text" value={pet.name} onChange={(e) => updatePet(index, 'name', e.target.value)} placeholder="e.g., Buddy" className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-0" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Breed *</label>
                          <input type="text" value={pet.breed} onChange={(e) => updatePet(index, 'breed', e.target.value)} placeholder="e.g., Golden Retriever" className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-0" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                          <input type="text" value={pet.age} onChange={(e) => updatePet(index, 'age', e.target.value)} placeholder="e.g., 2 years" className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-0" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Weight</label>
                          <input type="text" value={pet.weight} onChange={(e) => updatePet(index, 'weight', e.target.value)} placeholder="e.g., 30 lbs" className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-0" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Special Needs / Notes</label>
                        <textarea value={pet.specialNeeds} onChange={(e) => updatePet(index, 'specialNeeds', e.target.value)} placeholder="Medications, dietary restrictions..." rows={2} className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-0" />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={pet.vaccinated} onChange={(e) => updatePet(index, 'vaccinated', e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
                          <span className="text-sm text-neutral-700">Vaccinations up to date</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={pet.neutered} onChange={(e) => updatePet(index, 'neutered', e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
                          <span className="text-sm text-neutral-700">Spayed/Neutered</span>
                        </label>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Additional Requests</label>
                  <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any special requests..." rows={3} className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-0" />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Review & Confirm</h2>
                <div className="bg-neutral-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-neutral-600">Service</span><span className="font-medium">{serviceType && SERVICES[serviceType].name}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-600">{serviceType === 'dog-daycare' ? 'Date' : 'Check-in'}</span><span className="font-medium">{checkIn && new Date(checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
                    {serviceType !== 'dog-daycare' && <div className="flex justify-between"><span className="text-neutral-600">Check-out</span><span className="font-medium">{checkOut && new Date(checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>}
                    <div className="flex justify-between"><span className="text-neutral-600">Pets</span><span className="font-medium">{pets.filter(p => p.name).map(p => p.name).join(', ') || '1 pet'}</span></div>
                    <hr className="my-4" />
                    <div className="flex justify-between"><span className="text-neutral-600">${serviceType && SERVICES[serviceType].price}/{serviceType === 'dog-daycare' ? 'day' : 'night'} × {calculateNights() || 1} {serviceType === 'dog-daycare' ? 'day(s)' : 'night(s)'}</span><span className="font-medium">${serviceType ? SERVICES[serviceType].price * (calculateNights() || 1) : 0}</span></div>
                    {pets.filter(p => p.name).length > 1 && <div className="flex justify-between text-green-600"><span>Multi-pet discount (10%)</span><span>-${Math.round(calculateTotal() * 0.1 / 0.9)}</span></div>}
                    <hr className="my-4" />
                    <div className="flex justify-between text-xl font-bold"><span>Total</span><span className="text-primary-700">${calculateTotal().toFixed(2)}</span></div>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="w-5 h-5 mt-0.5 text-primary-600 rounded" />
                    <span className="text-sm text-neutral-600">I agree to the Terms of Service and Cancellation Policy. I confirm that my pet&apos;s vaccinations are current.</span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-xl"><Shield className="w-6 h-6 mx-auto text-green-600 mb-1" /><span className="text-xs text-green-700">Insured</span></div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl"><CreditCard className="w-6 h-6 mx-auto text-blue-600 mb-1" /><span className="text-xs text-blue-700">Secure Payment</span></div>
                  <div className="text-center p-3 bg-yellow-50 rounded-xl"><Star className="w-6 h-6 mx-auto text-yellow-600 mb-1" /><span className="text-xs text-yellow-700">5.0 Rating</span></div>
                </div>
                {!isLoggedIn && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Account Required</p>
                        <p className="text-sm text-amber-700">Please <Link href="/login?redirect=/book" className="underline">sign in</Link> or <Link href="/register?redirect=/book" className="underline">create an account</Link> to complete your booking.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
            {step > 1 ? (
              <motion.button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-6 py-3 text-neutral-600 hover:text-neutral-900" whileHover={{ x: -5 }}>
                <ArrowLeft className="w-5 h-5" /> Back
              </motion.button>
            ) : <div />}
            {step < 4 ? (
              <motion.button onClick={() => setStep(step + 1)} disabled={!canProceed()} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold ${canProceed() ? 'bg-primary-700 text-white hover:bg-primary-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`} whileHover={canProceed() ? { scale: 1.02 } : {}} whileTap={canProceed() ? { scale: 0.98 } : {}}>
                Continue <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button onClick={handleCheckout} disabled={!canProceed() || loading} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold ${canProceed() && !loading ? 'bg-primary-700 text-white hover:bg-primary-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`} whileHover={canProceed() && !loading ? { scale: 1.02 } : {}} whileTap={canProceed() && !loading ? { scale: 0.98 } : {}}>
                {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</> : <><CreditCard className="w-5 h-5" /> {isLoggedIn ? `Pay $${calculateTotal().toFixed(2)}` : 'Sign In to Pay'}</>}
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-8 text-neutral-500 text-sm">
          Questions? Call <a href="tel:6177628179" className="text-primary-600 hover:underline">(617) 762-8179</a> or email <a href="mailto:choi.coco0328@gmail.com" className="text-primary-600 hover:underline">choi.coco0328@gmail.com</a>
        </motion.div>
      </div>
    </div>
  )
}
