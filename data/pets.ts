export interface CurrentPet {
    id: string
    name: string
    type: 'cat' | 'dog'
    breed: string
    age?: string
    status: 'resident' | 'boarding'
    personality: string[]
    favoriteActivities: string[]
    image: string // Main cover image
    images: string[] // Array of 3 images for gallery
    joinedDate: string
}

export const currentPets: CurrentPet[] = [
    // Cats
    {
        id: 'cat-1',
        name: 'Bibi',
        type: 'cat',
        breed: 'Munchkin Silver Shaded',
        status: 'resident',
        personality: ['Playful', 'Curious', 'Affectionate'],
        favoriteActivities: ['Chasing toys', 'Sunbathing', 'Cuddles'],
        image: '/pets/bibi/bibi-1.jpg',
        images: [
            '/pets/bibi/bibi-1.jpg',
            '/pets/bibi/bibi-2.jpg',
            '/pets/bibi/bibi-3.jpg'
        ],
        joinedDate: '2023-08-10'
    },
    {
        id: 'cat-2',
        name: 'Dudu',
        type: 'cat',
        breed: 'British Shorthair Golden',
        status: 'resident',
        personality: ['Gentle', 'Calm', 'Friendly'],
        favoriteActivities: ['Napping', 'Bird watching', 'Treats'],
        image: '/pets/dudu/dudu-1.jpg',
        images: [
            '/pets/dudu/dudu-1.jpg',
            '/pets/dudu/dudu-2.jpg',
            '/pets/dudu/dudu-3.jpg'
        ],
        joinedDate: '2025-02-08'
    },
    {
        id: 'cat-3',
        name: 'Fifi',
        type: 'cat',
        breed: 'Golden British Shorthair',
        status: 'boarding',
        personality: ['Energetic', 'Playful', 'Adorable'],
        favoriteActivities: ['Playing with feathers', 'Exploring', 'Milk time'],
        image: '/pets/fifi/fifi-1.jpg',
        images: [
            '/pets/fifi/fifi-1.jpg',
            '/pets/fifi/fifi-2.jpg',
            '/pets/fifi/fifi-3.jpg'
        ],
        joinedDate: '2024-09-01'
    },
    {
        id: 'cat-4',
        name: 'Meimei',
        type: 'cat',
        breed: 'Ragdoll',
        status: 'boarding',
        personality: ['Sweet', 'Docile', 'Loving'],
        favoriteActivities: ['Being held', 'Grooming', 'Quiet play'],
        image: '/pets/meimei/meimei-1.jpg',
        images: [
            '/pets/meimei/meimei-1.jpg',
            '/pets/meimei/meimei-2.jpg',
            '/pets/meimei/meimei-3.jpg'
        ],
        joinedDate: '2024-06-15'
    },
    {
        id: 'cat-5',
        name: 'Neon',
        type: 'cat',
        breed: 'Ragdoll',
        status: 'boarding',
        personality: ['Independent', 'Elegant', 'Observant'],
        favoriteActivities: ['High perches', 'Solo play', 'Window watching'],
        image: '/pets/neon/neon-1.jpg',
        images: [
            '/pets/neon/neon-1.jpg',
            '/pets/neon/neon-2.jpg',
            '/pets/neon/neon-3.jpg'
        ],
        joinedDate: '2024-07-20'
    },
    {
        id: 'cat-6',
        name: 'Xiabao',
        type: 'cat',
        breed: 'Ragdoll',
        status: 'boarding',
        personality: ['Playful', 'Social', 'Gentle'],
        favoriteActivities: ['Group play', 'Feather wands', 'Treats'],
        image: '/pets/xiabao/xiabao-1.jpg',
        images: [
            '/pets/xiabao/xiabao-1.jpg',
            '/pets/xiabao/xiabao-2.jpg',
            '/pets/xiabao/xiabao-3.jpg'
        ],
        joinedDate: '2024-08-10'
    },
    {
        id: 'cat-7',
        name: 'Mia',
        type: 'cat',
        breed: 'Ragdoll',
        status: 'boarding',
        personality: ['Affectionate', 'Quiet', 'Sweet'],
        favoriteActivities: ['Lap sitting', 'Soft toys', 'Gentle pets'],
        image: '/pets/mia-cat/mia-1.jpg',
        images: [
            '/pets/mia-cat/mia-1.jpg',
            '/pets/mia-cat/mia-2.jpg',
            '/pets/mia-cat/mia-3.jpg'
        ],
        joinedDate: '2024-08-25'
    },
    {
        id: 'cat-8',
        name: 'Tutu',
        type: 'cat',
        breed: 'Siamese',
        status: 'boarding',
        personality: ['Vocal', 'Active', 'Intelligent'],
        favoriteActivities: ['Talking', 'Puzzle toys', 'Climbing'],
        image: '/pets/tutu/tutu-1.jpg',
        images: [
            '/pets/tutu/tutu-1.jpg',
            '/pets/tutu/tutu-2.jpg',
            '/pets/tutu/tutu-3.jpg'
        ],
        joinedDate: '2024-09-05'
    },
    {
        id: 'cat-9',
        name: 'Xianbei',
        type: 'cat',
        breed: 'Silver Shaded',
        status: 'boarding',
        personality: ['Calm', 'Dignified', 'Observant'],
        favoriteActivities: ['Quiet spaces', 'Grooming', 'Watching others'],
        image: '/pets/xianbei/xianbei-1.jpg',
        images: [
            '/pets/xianbei/xianbei-1.jpg',
            '/pets/xianbei/xianbei-2.jpg',
            '/pets/xianbei/xianbei-3.jpg'
        ],
        joinedDate: '2024-09-10'
    },
    {
        id: 'cat-10',
        name: 'Chacha',
        type: 'cat',
        breed: 'Silver Shaded',
        status: 'boarding',
        personality: ['Friendly', 'Curious', 'Adaptable'],
        favoriteActivities: ['Exploring', 'Making friends', 'Cat TV'],
        image: '/pets/chacha/chacha-1.jpg',
        images: [
            '/pets/chacha/chacha-1.jpg',
            '/pets/chacha/chacha-2.jpg',
            '/pets/chacha/chacha-3.jpg'
        ],
        joinedDate: '2024-09-15'
    },
    {
        id: 'cat-11',
        name: 'Yaya',
        type: 'cat',
        breed: 'Black Cat',
        status: 'boarding',
        personality: ['Mysterious', 'Playful', 'Loyal'],
        favoriteActivities: ['Night play', 'Hide and seek', 'String toys'],
        image: '/pets/yaya/yaya-1.jpg',
        images: [
            '/pets/yaya/yaya-1.jpg',
            '/pets/yaya/yaya-2.jpg',
            '/pets/yaya/yaya-3.jpg'
        ],
        joinedDate: '2024-09-20'
    },
    {
        id: 'cat-12',
        name: 'Er Gou',
        type: 'cat',
        breed: 'Tuxedo Cat',
        status: 'boarding',
        personality: ['Mischievous', 'Energetic', 'Loving'],
        favoriteActivities: ['Running', 'Playing with balls', 'Attention'],
        image: '/pets/ergou/ergou-1.jpg',
        images: [
            '/pets/ergou/ergou-1.jpg',
            '/pets/ergou/ergou-2.jpg',
            '/pets/ergou/ergou-3.jpg'
        ],
        joinedDate: '2024-09-25'
    },
    {
        id: 'cat-13',
        name: 'Chouchou',
        type: 'cat',
        breed: 'Orange Tabby',
        status: 'boarding',
        personality: ['Laid-back', 'Food-loving', 'Cuddly'],
        favoriteActivities: ['Eating', 'Sleeping', 'Belly rubs'],
        image: '/pets/chouchou/chouchou-1.jpg',
        images: [
            '/pets/chouchou/chouchou-1.jpg',
            '/pets/chouchou/chouchou-2.jpg',
            '/pets/chouchou/chouchou-3.jpg'
        ],
        joinedDate: '2024-10-01'
    },
    {
        id: 'cat-14',
        name: 'Xiaojin',
        type: 'cat',
        breed: 'Golden British Shorthair',
        status: 'boarding',
        personality: ['Charming', 'Gentle', 'Sociable'],
        favoriteActivities: ['Lounging', 'Being admired', 'Treat time'],
        image: '/pets/xiaojin/xiaojin-1.jpg',
        images: [
            '/pets/xiaojin/xiaojin-1.jpg',
            '/pets/xiaojin/xiaojin-2.jpg',
            '/pets/xiaojin/xiaojin-3.jpg'
        ],
        joinedDate: '2024-11-15'
    },
    {
        id: 'cat-15',
        name: 'Mituan',
        type: 'cat',
        breed: 'British Shorthair Lilac Golden',
        status: 'boarding',
        personality: ['Sweet', 'Calm', 'Cuddly'],
        favoriteActivities: ['Napping', 'Gentle play', 'Snuggling'],
        image: '/pets/mituan/mituan-1.jpg',
        images: [
            '/pets/mituan/mituan-1.jpg',
            '/pets/mituan/mituan-2.jpg',
            '/pets/mituan/mituan-3.jpg'
        ],
        joinedDate: '2024-11-20'
    },
    // Dogs
    {
        id: 'dog-1',
        name: 'Oscar',
        type: 'dog',
        breed: 'Golden Retriever',
        status: 'boarding',
        personality: ['Puppy Energy', 'Friendly', 'Eager to Learn'],
        favoriteActivities: ['Fetch', 'Puppy play', 'Training treats'],
        image: '/pets/oscar/oscar-1.jpg',
        images: [
            '/pets/oscar/oscar-1.jpg',
            '/pets/oscar/oscar-2.jpg',
            '/pets/oscar/oscar-3.jpg'
        ],
        joinedDate: '2024-09-01'
    },
    {
        id: 'dog-2',
        name: 'Loki',
        type: 'dog',
        breed: 'Greyhound',
        status: 'boarding',
        personality: ['Fast', 'Gentle', 'Calm Indoors'],
        favoriteActivities: ['Running', 'Couch lounging', 'Gentle walks'],
        image: '/pets/loki/loki-1.jpg',
        images: [
            '/pets/loki/loki-1.jpg',
            '/pets/loki/loki-2.jpg',
            '/pets/loki/loki-3.jpg'
        ],
        joinedDate: '2024-07-15'
    },
    {
        id: 'dog-3',
        name: 'Nana',
        type: 'dog',
        breed: 'Border Collie',
        status: 'boarding',
        personality: ['Intelligent', 'Active', 'Herding Instinct'],
        favoriteActivities: ['Agility', 'Frisbee', 'Problem solving'],
        image: '/pets/nana/nana-1.jpg',
        images: [
            '/pets/nana/nana-1.jpg',
            '/pets/nana/nana-2.jpg',
            '/pets/nana/nana-3.jpg'
        ],
        joinedDate: '2024-08-01'
    },
    {
        id: 'dog-4',
        name: 'Richard',
        type: 'dog',
        breed: 'Border Collie',
        status: 'boarding',
        personality: ['Smart', 'Energetic', 'Focused'],
        favoriteActivities: ['Training', 'Ball games', 'Running'],
        image: '/pets/richard/richard-1.jpg',
        images: [
            '/pets/richard/richard-1.jpg',
            '/pets/richard/richard-2.jpg',
            '/pets/richard/richard-3.jpg'
        ],
        joinedDate: '2024-08-10'
    },
    {
        id: 'dog-5',
        name: 'Tata',
        type: 'dog',
        breed: 'Border Collie',
        status: 'boarding',
        personality: ['Playful', 'Alert', 'Loyal'],
        favoriteActivities: ['Herding games', 'Tricks', 'Long walks'],
        image: '/pets/tata/tata-1.jpg',
        images: [
            '/pets/tata/tata-1.jpg',
            '/pets/tata/tata-2.jpg',
            '/pets/tata/tata-3.jpg'
        ],
        joinedDate: '2024-08-20'
    },
    {
        id: 'dog-6',
        name: 'Caicai',
        type: 'dog',
        breed: 'Shiba Inu',
        status: 'boarding',
        personality: ['Independent', 'Alert', 'Spirited'],
        favoriteActivities: ['Exploring', 'Tug of war', 'Puzzle toys'],
        image: '/pets/caicai/caicai-1.jpg',
        images: [
            '/pets/caicai/caicai-1.jpg',
            '/pets/caicai/caicai-2.jpg',
            '/pets/caicai/caicai-3.jpg'
        ],
        joinedDate: '2024-09-05'
    },
    {
        id: 'dog-7',
        name: 'Mia',
        type: 'dog',
        breed: 'American Cocker Spaniel',
        status: 'boarding',
        personality: ['Gentle', 'Happy', 'Affectionate'],
        favoriteActivities: ['Grooming', 'Gentle play', 'Cuddles'],
        image: '/pets/mia-dog/mia-1.jpg',
        images: [
            '/pets/mia-dog/mia-1.jpg',
            '/pets/mia-dog/mia-2.jpg',
            '/pets/mia-dog/mia-3.jpg'
        ],
        joinedDate: '2024-09-12'
    },
    {
        id: 'dog-8',
        name: 'Nova',
        type: 'dog',
        breed: 'Golden Retriever',
        status: 'boarding',
        personality: ['Friendly', 'Patient', 'Loving'],
        favoriteActivities: ['Swimming', 'Fetch', 'Meeting friends'],
        image: '/pets/nova/nova-1.jpg',
        images: [
            '/pets/nova/nova-1.jpg',
            '/pets/nova/nova-2.jpg',
            '/pets/nova/nova-3.jpg',
            '/pets/nova/nova-4.jpg',
            '/pets/nova/nova-5.jpg',
            '/pets/nova/nova-6.jpg',
            '/pets/nova/nova-7.jpg',

        ],
        joinedDate: '2024-09-18'
    },
    {
        id: 'dog-9',
        name: 'Haha',
        type: 'dog',
        breed: 'Samoyed',
        status: 'boarding',
        personality: ['Cheerful', 'Friendly', 'Fluffy'],
        favoriteActivities: ['Playing in snow', 'Smiling', 'Cuddles'],
        image: '/pets/haha/haha-1.jpg',
        images: [
            '/pets/haha/haha-1.jpg',
            '/pets/haha/haha-2.jpg',
            '/pets/haha/haha-3.jpg'
        ],
        joinedDate: '2024-10-05'
    },
    {
        id: 'dog-10',
        name: 'Jiujiu',
        type: 'dog',
        breed: 'Samoyed',
        status: 'boarding',
        personality: ['Gentle', 'Playful', 'Sweet'],
        favoriteActivities: ['Running', 'Being brushed', 'Treats'],
        image: '/pets/jiujiu/jiujiu-1.jpg',
        images: [
            '/pets/jiujiu/jiujiu-1.jpg',
            '/pets/jiujiu/jiujiu-2.jpg',
            '/pets/jiujiu/jiujiu-3.jpg'
        ],
        joinedDate: '2024-10-10'
    },
    {
        id: 'dog-11',
        name: 'Toast',
        type: 'dog',
        breed: 'Standard Poodle',
        status: 'boarding',
        personality: ['Intelligent', 'Elegant', 'Active'],
        favoriteActivities: ['Learning tricks', 'Swimming', 'Agility'],
        image: '/pets/toast/toast-1.jpg',
        images: [
            '/pets/toast/toast-1.jpg',
            '/pets/toast/toast-2.jpg',
            '/pets/toast/toast-3.jpg'
        ],
        joinedDate: '2024-10-15'
    },
    {
        id: 'dog-12',
        name: 'Honey',
        type: 'dog',
        breed: 'Labrador Retriever',
        status: 'boarding',
        personality: ['Loyal', 'Outgoing', 'Gentle'],
        favoriteActivities: ['Fetching', 'Swimming', 'Snuggling'],
        image: '/pets/honey/honey-1.jpg',
        images: [
            '/pets/honey/honey-1.jpg',
            '/pets/honey/honey-2.jpg',
            '/pets/honey/honey-3.jpg'
        ],
        joinedDate: '2024-10-20'
    },
    {
        id: 'dog-13',
        name: 'Nina',
        type: 'dog',
        breed: 'Siberian Husky',
        status: 'boarding',
        personality: ['Adventurous', 'Vocal', 'Friendly'],
        favoriteActivities: ['Running', 'Howling', 'Playing in snow'],
        image: '/pets/nina/nina-1.jpg',
        images: [
            '/pets/nina/nina-1.jpg',
            '/pets/nina/nina-2.jpg',
            '/pets/nina/nina-3.jpg'
        ],
        joinedDate: '2024-10-25'
    },
    {
        id: 'dog-14',
        name: 'Marble',
        type: 'dog',
        breed: 'Whippet',
        status: 'boarding',
        personality: ['Graceful', 'Calm', 'Affectionate'],
        favoriteActivities: ['Sprinting', 'Cuddling', 'Sunbathing'],
        image: '/pets/marble/marble-1.jpg',
        images: [
            '/pets/marble/marble-1.jpg',
            '/pets/marble/marble-2.jpg',
            '/pets/marble/marble-3.jpg'
        ],
        joinedDate: '2024-11-01'
    },
    {
        id: 'dog-15',
        name: 'Bobo',
        type: 'dog',
        breed: 'Long-haired Miniature Dachshund',
        status: 'boarding',
        personality: ['Curious', 'Brave', 'Playful'],
        favoriteActivities: ['Digging', 'Exploring', 'Lap time'],
        image: '/pets/bobo/bobo-1.jpg',
        images: [
            '/pets/bobo/bobo-1.jpg',
            '/pets/bobo/bobo-2.jpg',
            '/pets/bobo/bobo-3.jpg'
        ],
        joinedDate: '2024-11-05'
    },
    {
        id: 'dog-16',
        name: 'Huhu',
        type: 'dog',
        breed: 'Golden Retriever',
        status: 'boarding',
        personality: ['Friendly', 'Devoted', 'Playful'],
        favoriteActivities: ['Fetch', 'Swimming', 'Making friends'],
        image: '/pets/huhu/huhu-1.jpg',
        images: [
            '/pets/huhu/huhu-1.jpg',
            '/pets/huhu/huhu-2.jpg',
            '/pets/huhu/huhu-3.jpg'
        ],
        joinedDate: '2024-11-10'
    },
    {
        id: 'dog-17',
        name: 'Cooper',
        type: 'dog',
        breed: 'Golden Retriever',
        status: 'boarding',
        personality: ['Friendly', 'Intimated', 'lovely'],
        favoriteActivities: ['Comforting people', 'Staying with people', 'Making friends'],
        image: '/pets/cooper/cooper-1.jpg',
        images: [
            '/pets/cooper/cooper-1.jpg',
            '/pets/cooper/cooper-2.jpg',
            '/pets/cooper/cooper-3.jpg'
        ],
        joinedDate: '2024-11-30'
    }
]