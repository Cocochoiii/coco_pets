// config/index.ts
// Centralized configuration for Coco's Pet Paradise

interface PromoCode {
  type: 'percentage' | 'fixed'
  value: number
  minDays: number
}

interface Config {
  app: {
    name: string
    url: string
    env: string
    isDev: boolean
    isProd: boolean
  }
  business: {
    name: string
    email: string
    phone: string
    address: string
    serviceRadius: number
    timezone: string
  }
  auth: {
    jwtSecret: string
    jwtExpiresIn: string
    refreshTokenExpiresIn: string
    bcryptRounds: number
    maxLoginAttempts: number
    lockoutDuration: number
  }
  database: {
    uri: string
  }
  stripe: {
    publishableKey: string
    secretKey: string
    webhookSecret: string
    currency: string
  }
  pricing: {
    cat: { daily: number }
    dog: { small: number; medium: number; large: number }
    addOns: Record<string, number>
    discounts: Record<string, number>
    promoCodes: Record<string, PromoCode>
    depositPercentage: number
    taxRate: number
  }
  capacity: {
    cats: { total: number; default: number }
    dogs: { total: number; default: number }
  }
  notifications: {
    vapidPublicKey: string
    vapidPrivateKey: string
    vapidEmail: string
  }
  email: {
    from: string
    replyTo: string
  }
  upload: {
    maxFileSize: number
    allowedImageTypes: string[]
    allowedDocTypes: string[]
  }
  rateLimit: {
    windowMs: number
    max: { default: number; auth: number; register: number; payment: number }
  }
  admin: {
    email: string
  }
  cron: {
    secret: string
  }
}

const config: Config = {
  app: {
    name: "Coco's Pet Paradise",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  },

  business: {
    name: "Coco's Pet Paradise",
    email: 'hcaicoco@gmail.com',
    phone: '(617) 762-8179',
    address: '123 Pet Lane, Wellesley Hills, MA 02481',
    serviceRadius: 50,
    timezone: 'America/New_York',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshTokenExpiresIn: '30d',
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000,
  },

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cocos-pet-paradise',
  },

  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    currency: 'usd',
  },

  pricing: {
    cat: { daily: 2500 },
    dog: { small: 4000, medium: 5000, large: 6000 },
    addOns: {
      grooming: 3500,
      training: 2500,
      medication: 500,
      premium_food: 1000,
      extra_playtime: 1500,
      photo_updates: 500,
      pickup_delivery: 2500,
    },
    discounts: {
      weekly: 0.10,
      biweekly: 0.12,
      monthly: 0.15,
      returning: 0.05,
      referral: 0.10,
      multiPet: 0.10,
    },
    promoCodes: {
      WELCOME10: { type: 'percentage', value: 10, minDays: 1 },
      REFER15: { type: 'percentage', value: 15, minDays: 1 },
      HOLIDAY20: { type: 'percentage', value: 20, minDays: 3 },
      VIP25: { type: 'percentage', value: 25, minDays: 7 },
      FIRSTTIME: { type: 'percentage', value: 15, minDays: 1 },
      FLAT50: { type: 'fixed', value: 5000, minDays: 5 },
    },
    depositPercentage: 0.30,
    taxRate: 0.0625,
  },

  capacity: {
    cats: { total: 10, default: 8 },
    dogs: { total: 6, default: 4 },
  },

  notifications: {
    vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || '',
    vapidEmail: process.env.VAPID_EMAIL || 'mailto:hcaicoco@gmail.com',
  },

  email: {
    from: process.env.EMAIL_FROM || 'noreply@cocospetparadise.com',
    replyTo: 'hcaicoco@gmail.com',
  },

  upload: {
    maxFileSize: 10 * 1024 * 1024,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocTypes: ['application/pdf'],
  },

  rateLimit: {
    windowMs: 60 * 1000,
    max: { default: 100, auth: 10, register: 5, payment: 20 },
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'hcaicoco@gmail.com',
  },

  cron: {
    secret: process.env.CRON_SECRET || 'your-cron-secret-key',
  },
}

export default config