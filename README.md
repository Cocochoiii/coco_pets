# 🐾 Coco's Pet Paradise - Commercial Grade

Premium pet boarding service platform with full-stack Next.js 14, TypeScript, MongoDB, and Stripe integration.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

## ✨ Features

### 🔐 Authentication System
- JWT-based authentication with refresh tokens
- Secure password hashing (bcrypt)
- Role-based access control (customer/staff/admin)
- Account lockout protection
- Email verification ready

### 💳 Payment Processing (Stripe)
- Secure checkout sessions
- Full payment & deposit options (30%/50%)
- Webhook handling for payment events
- Automated refund processing
- Payment history tracking

### 📅 Booking System
- Real-time availability checking
- Dynamic pricing with discounts
- Multiple add-on services
- Promo code support
- Automated reminders

### 💬 Communication
- Real-time chat widget
- Push notifications (Web Push API)
- Email notifications
- In-app notification center

### 📊 Admin Dashboard
- Analytics & reporting
- User management
- Booking management
- Revenue tracking

### 📱 PWA Support
- Offline functionality
- Push notifications
- Installable app
- Service worker caching

## 📁 Project Structure

```
cocos-pet-paradise-pro/
├── app/
│   ├── api/
│   │   ├── admin/          # Admin endpoints
│   │   ├── auth/           # Authentication
│   │   ├── bookings/       # Booking management
│   │   ├── chat/           # Chat system
│   │   ├── cron/           # Scheduled tasks
│   │   ├── notifications/  # Notifications
│   │   ├── payments/       # Stripe integration
│   │   ├── pets/           # Pet management
│   │   ├── reviews/        # Review system
│   │   └── upload/         # File uploads
│   ├── payment/            # Payment pages
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/             # React components
├── config/                 # Configuration
├── contexts/               # React contexts
├── hooks/                  # Custom hooks
├── lib/                    # Utilities
│   ├── services/           # Email service
│   ├── api-utils.ts
│   ├── auth.ts
│   ├── mongodb.ts
│   ├── pets.ts
│   ├── stripe.ts
│   └── virtual-tour.ts
├── models/                 # MongoDB models
├── public/
│   ├── audio/
│   ├── icons/
│   ├── pets/               # 32 pet folders
│   ├── svgs/               # Decorative SVGs
│   ├── videos/
│   ├── virtual-tour/
│   ├── manifest.json
│   ├── offline.html
│   └── sw.js
├── types/                  # TypeScript types
├── middleware.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## 💰 Pricing Structure

| Service | Rate |
|---------|------|
| Cat Boarding | $25/night |
| Small Dog | $40/night |
| Medium Dog | $50/night |
| Large Dog | $60/night |

### Discounts
- Weekly (7+ days): 10%
- Bi-weekly (14+ days): 12%
- Monthly (30+ days): 15%
- Returning customer: 5%

### Promo Codes
- `WELCOME10` - 10% off (new customers)
- `REFER15` - 15% off (referral)
- `HOLIDAY20` - 20% off (3+ days)
- `VIP25` - 25% off (7+ days)
- `FLAT50` - $50 off (5+ days)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `POST /api/auth/refresh` - Refresh token

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings` - Update booking

### Payments
- `POST /api/payments/checkout` - Create checkout
- `GET /api/payments/checkout` - Get session status
- `POST /api/payments/calculate` - Calculate price
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/history` - Payment history
- `POST /api/payments/webhook` - Stripe webhook

### Pets
- `GET /api/pets` - List pets
- `POST /api/pets` - Add pet
- `PUT /api/pets` - Update pet
- `DELETE /api/pets` - Remove pet

### Admin
- `GET /api/admin/analytics` - Dashboard data
- `GET /api/admin/users` - List users
- `PUT /api/admin/users` - Update user
- `GET /api/admin/bookings` - List all bookings

### Other
- `GET /api/availability` - Check availability
- `GET /api/chat` - List conversations
- `POST /api/chat` - Send message
- `GET /api/notifications` - List notifications
- `GET /api/reviews` - List reviews
- `GET /api/health` - Health check

## 🎨 Media Files

Copy your media files to:

```
public/
├── audio/
│   └── animal-crossing-bgm.mp3
├── pets/
│   ├── bibi/
│   │   ├── bibi-1.jpg
│   │   ├── bibi-2.jpg
│   │   └── bibi-3.jpg
│   └── ... (32 pet folders)
├── svgs/
│   ├── booking-decoration.svg
│   ├── booking-decoration2.svg
│   ├── contact-decoration.svg
│   ├── contact-decoration2.svg
│   ├── current-pets-left.svg
│   ├── current-pets-right.svg
│   ├── left-decoration.svg
│   ├── right-decoration.svg
│   ├── service-area-decoration2.svg
│   ├── service-area-hours.svg
│   ├── services-decoration.svg
│   ├── services-decoration2.svg
│   ├── testimonials-decoration.svg
│   ├── testimonials-decoration2.svg
│   ├── tour-decoration-left.svg
│   └── tour-decoration-right.svg
├── videos/
│   ├── Bibi.mp4
│   └── ... (pet videos)
└── virtual-tour/
    ├── bedroom.jpg
    ├── cat-play.jpg
    ├── cat-room.jpg
    ├── deck.jpg
    ├── dining.jpg
    ├── dog-play.jpg
    ├── dog-room.jpg
    ├── entrance.jpg
    ├── garden.jpg
    ├── kitchen.jpg
    ├── living-room.jpg
    ├── quiet-room.jpg
    └── spa.jpg
```

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Required Environment Variables
- `MONGODB_URI`
- `JWT_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `CRON_SECRET`

## ⚙️ Cron Jobs

Set up scheduled tasks:

```bash
# Reminders (daily at 9 AM)
curl -X POST https://your-domain.com/api/cron/reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Cleanup (daily at 2 AM)
curl -X POST https://your-domain.com/api/cron/cleanup \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

## 📱 PWA Setup

Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

## 📞 Contact

Coco's Pet Paradise  
📍 Wellesley Hills, MA  
📞 (617) 762-8179  
📧 hcaicoco@gmail.com

---

Made with ❤️ for furry friends
