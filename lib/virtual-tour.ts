// lib/virtual-tour.ts

export interface TourRoom {
  id: string
  name: string
  description: string
  image: string
  features: string[]
  category: 'common' | 'cat' | 'dog' | 'outdoor'
}

export const virtualTourRooms: TourRoom[] = [
  {
    id: 'entrance',
    name: 'Welcome Entrance',
    description: 'A warm and inviting entrance where you and your pet are greeted with love. Our check-in process is smooth and stress-free.',
    image: '/virtual-tour/entrance.jpg',
    features: ['Comfortable waiting area', 'Pet-friendly check-in', 'Information desk', 'Safety protocols'],
    category: 'common',
  },
  {
    id: 'living-room',
    name: 'Cozy Living Room',
    description: 'Our spacious living room where pets can socialize and relax. Filled with comfortable furniture and natural light.',
    image: '/virtual-tour/living-room.jpg',
    features: ['Plush seating', 'Natural lighting', 'Climate controlled', 'Pet-safe furniture'],
    category: 'common',
  },
  {
    id: 'cat-room',
    name: 'Cat Paradise',
    description: 'A dedicated space for our feline friends with climbing structures, cozy hideaways, and sunny window perches.',
    image: '/virtual-tour/cat-room.jpg',
    features: ['Cat trees & climbing walls', 'Window perches', 'Cozy hideaways', 'Scratching posts'],
    category: 'cat',
  },
  {
    id: 'cat-play',
    name: 'Cat Play Area',
    description: 'Interactive play zone with toys, tunnels, and activities to keep cats entertained and exercised.',
    image: '/virtual-tour/cat-play.jpg',
    features: ['Interactive toys', 'Tunnel systems', 'Feather wands', 'Laser play sessions'],
    category: 'cat',
  },
  {
    id: 'dog-room',
    name: 'Dog Suite',
    description: 'Comfortable accommodations for our canine guests with orthopedic beds and personalized spaces.',
    image: '/virtual-tour/dog-room.jpg',
    features: ['Orthopedic beds', 'Individual spaces', 'Calming music', 'Night lights'],
    category: 'dog',
  },
  {
    id: 'dog-play',
    name: 'Dog Play Zone',
    description: 'Indoor play area for dogs with agility equipment and plenty of room to run and play.',
    image: '/virtual-tour/dog-play.jpg',
    features: ['Agility equipment', 'Ball pit area', 'Tug toys', 'Supervised play'],
    category: 'dog',
  },
  {
    id: 'garden',
    name: 'Garden Oasis',
    description: 'Beautiful outdoor garden where pets can enjoy fresh air, sunshine, and explore nature safely.',
    image: '/virtual-tour/garden.jpg',
    features: ['Secure fencing', 'Shade areas', 'Pet-safe plants', 'Water features'],
    category: 'outdoor',
  },
  {
    id: 'deck',
    name: 'Sunny Deck',
    description: 'A wonderful outdoor deck perfect for supervised sunbathing and relaxation.',
    image: '/virtual-tour/deck.jpg',
    features: ['Comfortable loungers', 'Shade umbrellas', 'Fresh water stations', 'Scenic views'],
    category: 'outdoor',
  },
  {
    id: 'kitchen',
    name: 'Nutrition Center',
    description: 'Where we prepare nutritious meals tailored to each pet\'s dietary needs and preferences.',
    image: '/virtual-tour/kitchen.jpg',
    features: ['Premium pet food', 'Special diet options', 'Fresh water', 'Treat station'],
    category: 'common',
  },
  {
    id: 'bedroom',
    name: 'Quiet Rest Area',
    description: 'Peaceful sleeping quarters where pets can rest undisturbed in comfortable beds.',
    image: '/virtual-tour/bedroom.jpg',
    features: ['Quiet environment', 'Dim lighting option', 'Temperature control', 'Soft bedding'],
    category: 'common',
  },
  {
    id: 'spa',
    name: 'Grooming Spa',
    description: 'Full-service grooming spa for bathing, brushing, and pampering your furry friends.',
    image: '/virtual-tour/spa.jpg',
    features: ['Professional grooming', 'Gentle products', 'Nail trimming', 'Ear cleaning'],
    category: 'common',
  },
  {
    id: 'dining',
    name: 'Dining Area',
    description: 'A calm dining space where pets enjoy their meals at their own pace.',
    image: '/virtual-tour/dining.jpg',
    features: ['Individual feeding stations', 'Elevated bowls', 'Clean environment', 'Meal monitoring'],
    category: 'common',
  },
  {
    id: 'quiet-room',
    name: 'Quiet Room',
    description: 'A serene space for pets who prefer solitude or need a calm environment.',
    image: '/virtual-tour/quiet-room.jpg',
    features: ['Sound-proofed', 'Soft lighting', 'Calming scents', 'Private spaces'],
    category: 'common',
  },
]

export const getTourRoomsByCategory = (category: TourRoom['category']) => 
  virtualTourRooms.filter(room => room.category === category)

export const getTourRoomById = (id: string) => 
  virtualTourRooms.find(room => room.id === id)

export default virtualTourRooms
