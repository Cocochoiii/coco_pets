// lib/pets.ts
export interface PetData {
  id: string
  name: string
  type: 'cat' | 'dog'
  breed: string
  age: string
  personality: string
  isResident: boolean
  images: string[]
  videoUrl?: string
}

export const petsData: PetData[] = [
  // Resident Cats
  { id: 'bibi', name: 'Bibi', type: 'cat', breed: 'Munchkin Silver Shaded', age: '3 years', personality: 'Playful and curious', isResident: true, images: ['/pets/bibi/bibi-1.jpg', '/pets/bibi/bibi-2.jpg', '/pets/bibi/bibi-3.jpg'], videoUrl: '/videos/Bibi.mp4' },
  { id: 'dudu', name: 'Dudu', type: 'cat', breed: 'British Shorthair Golden', age: '2 years', personality: 'Calm and affectionate', isResident: true, images: ['/pets/dudu/dudu-1.jpg', '/pets/dudu/dudu-2.jpg', '/pets/dudu/dudu-3.jpg'], videoUrl: '/videos/Dudu.mp4' },
  // Guest Cats
  { id: 'bobo', name: 'Bobo', type: 'cat', breed: 'Scottish Fold', age: '2 years', personality: 'Sweet and gentle', isResident: false, images: ['/pets/bobo/bobo-1.jpg', '/pets/bobo/bobo-2.jpg', '/pets/bobo/bobo-3.jpg'], videoUrl: '/videos/Bobo.mp4' },
  { id: 'caicai', name: 'Caicai', type: 'cat', breed: 'Tabby', age: '1 year', personality: 'Energetic', isResident: false, images: ['/pets/caicai/caicai-1.jpg', '/pets/caicai/caicai-2.jpg', '/pets/caicai/caicai-3.jpg'], videoUrl: '/videos/Caicai.mp4' },
  { id: 'chacha', name: 'Chacha', type: 'cat', breed: 'Siamese Mix', age: '4 years', personality: 'Vocal and social', isResident: false, images: ['/pets/chacha/chacha-1.jpg', '/pets/chacha/chacha-2.jpg', '/pets/chacha/chacha-3.jpg'], videoUrl: '/videos/Chacha.mp4' },
  { id: 'chouchou', name: 'Chouchou', type: 'cat', breed: 'Persian', age: '3 years', personality: 'Laid-back', isResident: false, images: ['/pets/chouchou/chouchou-1.jpg', '/pets/chouchou/chouchou-2.jpg', '/pets/chouchou/chouchou-3.jpg'], videoUrl: '/videos/chouchou.mp4' },
  { id: 'fifi', name: 'Fifi', type: 'cat', breed: 'Ragdoll', age: '2 years', personality: 'Docile and sweet', isResident: false, images: ['/pets/fifi/fifi-1.jpg', '/pets/fifi/fifi-2.jpg', '/pets/fifi/fifi-3.jpg'], videoUrl: '/videos/Fifi.mp4' },
  { id: 'haha', name: 'Haha', type: 'cat', breed: 'American Shorthair', age: '1 year', personality: 'Playful joker', isResident: false, images: ['/pets/haha/haha-1.jpg', '/pets/haha/haha-2.jpg', '/pets/haha/haha-3.jpg'], videoUrl: '/videos/Haha.mp4' },
  { id: 'honey', name: 'Honey', type: 'cat', breed: 'Maine Coon', age: '4 years', personality: 'Gentle giant', isResident: false, images: ['/pets/honey/honey-1.jpg', '/pets/honey/honey-2.jpg', '/pets/honey/honey-3.jpg'], videoUrl: '/videos/Honey.mp4' },
  { id: 'huhu', name: 'Huhu', type: 'cat', breed: 'British Shorthair', age: '2 years', personality: 'Calm and cuddly', isResident: false, images: ['/pets/huhu/huhu-1.jpg', '/pets/huhu/huhu-2.jpg', '/pets/huhu/huhu-3.jpg'], videoUrl: '/videos/Huhu.mp4' },
  { id: 'jiujiu', name: 'Jiujiu', type: 'cat', breed: 'Exotic Shorthair', age: '3 years', personality: 'Sweet natured', isResident: false, images: ['/pets/jiujiu/jiujiu-1.jpg', '/pets/jiujiu/jiujiu-2.jpg', '/pets/jiujiu/jiujiu-3.jpg'], videoUrl: '/videos/Jiujiu.mp4' },
  { id: 'meimei', name: 'Meimei', type: 'cat', breed: 'Chinchilla', age: '2 years', personality: 'Elegant and quiet', isResident: false, images: ['/pets/meimei/meimei-1.jpg', '/pets/meimei/meimei-2.jpg', '/pets/meimei/meimei-3.jpg'], videoUrl: '/videos/Meimei.mp4' },
  { id: 'mia-cat', name: 'Mia', type: 'cat', breed: 'Bengal', age: '1 year', personality: 'Active and curious', isResident: false, images: ['/pets/mia-cat/mia-1.jpg', '/pets/mia-cat/mia-2.jpg', '/pets/mia-cat/mia-3.jpg'], videoUrl: '/videos/Mia_cat.mp4' },
  { id: 'mituan', name: 'Mituan', type: 'cat', breed: 'Munchkin', age: '2 years', personality: 'Adorable and playful', isResident: false, images: ['/pets/mituan/mituan-1.jpg', '/pets/mituan/mituan-2.jpg', '/pets/mituan/mituan-3.jpg'], videoUrl: '/videos/Mituan.mp4' },
  { id: 'nana', name: 'Nana', type: 'cat', breed: 'Russian Blue', age: '3 years', personality: 'Shy but loving', isResident: false, images: ['/pets/nana/nana-1.jpg', '/pets/nana/nana-2.jpg', '/pets/nana/nana-3.jpg'], videoUrl: '/videos/Nana.mp4' },
  { id: 'neon', name: 'Neon', type: 'cat', breed: 'Abyssinian', age: '2 years', personality: 'Athletic and smart', isResident: false, images: ['/pets/neon/neon-1.jpg', '/pets/neon/neon-2.jpg', '/pets/neon/neon-3.jpg'], videoUrl: '/videos/Neon.mp4' },
  { id: 'nina', name: 'Nina', type: 'cat', breed: 'Birman', age: '4 years', personality: 'Gentle and quiet', isResident: false, images: ['/pets/nina/nina-1.jpg', '/pets/nina/nina-2.jpg', '/pets/nina/nina-3.jpg'], videoUrl: '/videos/Nina.mp4' },
  { id: 'tutu', name: 'Tutu', type: 'cat', breed: 'Domestic Shorthair', age: '1 year', personality: 'Bouncy and fun', isResident: false, images: ['/pets/tutu/tutu-1.jpg', '/pets/tutu/tutu-2.jpg', '/pets/tutu/tutu-3.jpg'], videoUrl: '/videos/Tutu.mp4' },
  { id: 'xiabao', name: 'Xiabao', type: 'cat', breed: 'British Longhair', age: '2 years', personality: 'Fluffy and calm', isResident: false, images: ['/pets/xiabao/xiabao-1.jpg', '/pets/xiabao/xiabao-2.jpg', '/pets/xiabao/xiabao-3.jpg'], videoUrl: '/videos/XiaBao.mp4' },
  { id: 'xianbei', name: 'Xianbei', type: 'cat', breed: 'Siamese', age: '3 years', personality: 'Chatty and loving', isResident: false, images: ['/pets/xianbei/xianbei-1.jpg', '/pets/xianbei/xianbei-2.jpg', '/pets/xianbei/xianbei-3.jpg'], videoUrl: '/videos/Xianbei.mp4' },
  { id: 'xiaojin', name: 'Xiaojin', type: 'cat', breed: 'Golden British', age: '2 years', personality: 'Regal and calm', isResident: false, images: ['/pets/xiaojin/xiaojin-1.jpg', '/pets/xiaojin/xiaojin-2.jpg', '/pets/xiaojin/xiaojin-3.jpg'], videoUrl: '/videos/Xiaojin.mp4' },
  { id: 'yaya', name: 'Yaya', type: 'cat', breed: 'Ragdoll', age: '1 year', personality: 'Sweet and floppy', isResident: false, images: ['/pets/yaya/yaya-1.jpg', '/pets/yaya/yaya-2.jpg', '/pets/yaya/yaya-3.jpg'], videoUrl: '/videos/Yaya.mp4' },
  // Dogs
  { id: 'cooper', name: 'Cooper', type: 'dog', breed: 'Golden Retriever', age: '3 years', personality: 'Friendly and loyal', isResident: false, images: ['/pets/cooper/cooper-1.jpg', '/pets/cooper/cooper-2.jpg', '/pets/cooper/cooper-3.jpg'], videoUrl: '/videos/Cooper.mp4' },
  { id: 'ergou', name: 'Ergou', type: 'dog', breed: 'Corgi', age: '2 years', personality: 'Energetic and smart', isResident: false, images: ['/pets/ergou/ergou-1.jpg', '/pets/ergou/ergou-2.jpg', '/pets/ergou/ergou-3.jpg'], videoUrl: '/videos/Ergou.mp4' },
  { id: 'loki', name: 'Loki', type: 'dog', breed: 'Husky', age: '4 years', personality: 'Mischievous and vocal', isResident: false, images: ['/pets/loki/loki-1.jpg', '/pets/loki/loki-2.jpg', '/pets/loki/loki-3.jpg'], videoUrl: '/videos/Loki.mp4' },
  { id: 'marble', name: 'Marble', type: 'dog', breed: 'Australian Shepherd', age: '2 years', personality: 'Active and intelligent', isResident: false, images: ['/pets/marble/marble-1.jpg', '/pets/marble/marble-2.jpg', '/pets/marble/marble-3.jpg'], videoUrl: '/videos/Marble.mp4' },
  { id: 'mia-dog', name: 'Mia', type: 'dog', breed: 'Poodle', age: '3 years', personality: 'Elegant and smart', isResident: false, images: ['/pets/mia-dog/mia-1.jpg', '/pets/mia-dog/mia-2.jpg', '/pets/mia-dog/mia-3.jpg'], videoUrl: '/videos/Mia_dog.mp4' },
  { id: 'nova', name: 'Nova', type: 'dog', breed: 'Border Collie', age: '2 years', personality: 'Brilliant and active', isResident: false, images: ['/pets/nova/nova-1.jpg', '/pets/nova/nova-2.jpg', '/pets/nova/nova-3.jpg', '/pets/nova/nova-4.jpg', '/pets/nova/nova-5.jpg', '/pets/nova/nova-6.jpg', '/pets/nova/nova-7.jpg'], videoUrl: '/videos/Nova.mp4' },
  { id: 'oscar', name: 'Oscar', type: 'dog', breed: 'French Bulldog', age: '4 years', personality: 'Playful and charming', isResident: false, images: ['/pets/oscar/oscar-1.jpg', '/pets/oscar/oscar-2.jpg', '/pets/oscar/oscar-3.jpg'], videoUrl: '/videos/Oscar.mp4' },
  { id: 'richard', name: 'Richard', type: 'dog', breed: 'German Shepherd', age: '5 years', personality: 'Loyal and protective', isResident: false, images: ['/pets/richard/richard-1.jpg', '/pets/richard/richard-2.jpg', '/pets/richard/richard-3.jpg'], videoUrl: '/videos/Richard.mp4' },
  { id: 'tata', name: 'Tata', type: 'dog', breed: 'Shiba Inu', age: '2 years', personality: 'Independent and spirited', isResident: false, images: ['/pets/tata/tata-1.jpg', '/pets/tata/tata-2.jpg', '/pets/tata/tata-3.jpg'], videoUrl: '/videos/Tata.mp4' },
  { id: 'toast', name: 'Toast', type: 'dog', breed: 'Labrador', age: '3 years', personality: 'Friendly and outgoing', isResident: false, images: ['/pets/toast/toast-1.jpg', '/pets/toast/toast-2.jpg', '/pets/toast/toast-3.jpg'], videoUrl: '/videos/Toast.mp4' },
]

export const getCats = () => petsData.filter(p => p.type === 'cat')
export const getDogs = () => petsData.filter(p => p.type === 'dog')
export const getResidentPets = () => petsData.filter(p => p.isResident)
export const getGuestPets = () => petsData.filter(p => !p.isResident)
export const getPetById = (id: string) => petsData.find(p => p.id === id)
export const getPetByName = (name: string) => petsData.find(p => p.name.toLowerCase() === name.toLowerCase())
