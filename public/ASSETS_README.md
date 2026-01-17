# 📁 Public Assets Guide

This document explains the structure and naming conventions for media files.

## 📂 Directory Structure

```
public/
├── audio/
│   └── animal-crossing-bgm.mp3      # Background music
│
├── icons/                            # PWA icons
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
│
├── pets/                             # Pet photos (32 folders)
│   ├── bibi/
│   │   ├── bibi-1.jpg
│   │   ├── bibi-2.jpg
│   │   └── bibi-3.jpg
│   ├── dudu/
│   │   ├── dudu-1.jpg
│   │   ├── dudu-2.jpg
│   │   └── dudu-3.jpg
│   └── ... (other pets)
│
├── svgs/                             # Decorative SVGs
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
│
├── videos/                           # Pet videos
│   ├── Bibi.mp4
│   ├── Dudu.mp4
│   ├── Bobo.mp4
│   ├── chouchou.mp4                  # Note: lowercase
│   └── ... (other pets)
│
├── virtual-tour/                     # Virtual tour images
│   ├── bedroom.jpg
│   ├── cat-play.jpg
│   ├── cat-room.jpg
│   ├── deck.jpg
│   ├── dining.jpg
│   ├── dog-play.jpg
│   ├── dog-room.jpg
│   ├── entrance.jpg
│   ├── garden.jpg
│   ├── kitchen.jpg
│   ├── living-room.jpg
│   ├── quiet-room.jpg
│   └── spa.jpg
│
├── uploads/                          # Runtime uploads (empty)
│
├── manifest.json                     # PWA manifest
├── offline.html                      # Offline fallback
└── sw.js                             # Service worker
```

## 🐾 Pet Photo Naming

Format: `{petname}-{number}.jpg`

- All lowercase
- Numbers: 1, 2, 3 (Nova has 1-7)
- Example: `bibi-1.jpg`, `nova-7.jpg`

### Pet List (32 pets)
**Cats (22):** bibi, bobo, caicai, chacha, chouchou, dudu, fifi, haha, honey, huhu, jiujiu, meimei, mia-cat, mituan, nana, neon, nina, tutu, xiabao, xianbei, xiaojin, yaya

**Dogs (10):** cooper, ergou, loki, marble, mia-dog, nova, oscar, richard, tata, toast

## 🎬 Video Naming

Format: `{Petname}.mp4` (Capitalized first letter)

- Example: `Bibi.mp4`, `Cooper.mp4`
- Exception: `chouchou.mp4` (lowercase)
- Special: `Mia_cat.mp4`, `Mia_dog.mp4`

## 🖼️ SVG Decorations

These decorative SVGs are used across different sections:

| SVG File | Used In |
|----------|---------|
| booking-decoration.svg | Booking calendar section |
| booking-decoration2.svg | Booking calendar section |
| contact-decoration.svg | Contact section |
| contact-decoration2.svg | Contact section |
| current-pets-left.svg | Current pets gallery |
| current-pets-right.svg | Current pets gallery |
| left-decoration.svg | Hero/general |
| right-decoration.svg | Hero/general |
| service-area-decoration2.svg | Service area map |
| service-area-hours.svg | Service area/hours |
| services-decoration.svg | Services section |
| services-decoration2.svg | Services section |
| testimonials-decoration.svg | Testimonials section |
| testimonials-decoration2.svg | Testimonials section |
| tour-decoration-left.svg | Virtual tour |
| tour-decoration-right.svg | Virtual tour |

## 🏠 Virtual Tour Images

| Image | Room Name |
|-------|-----------|
| entrance.jpg | Welcome Entrance |
| living-room.jpg | Cozy Living Room |
| cat-room.jpg | Cat Paradise |
| cat-play.jpg | Cat Play Area |
| dog-room.jpg | Dog Suite |
| dog-play.jpg | Dog Play Zone |
| garden.jpg | Garden Oasis |
| deck.jpg | Sunny Deck |
| kitchen.jpg | Nutrition Center |
| bedroom.jpg | Quiet Rest Area |
| spa.jpg | Grooming Spa |
| dining.jpg | Dining Area |
| quiet-room.jpg | Quiet Room |

## 📱 PWA Icons

Required sizes for full PWA support:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

## 🔧 Quick Setup

1. Copy your existing `public` folder contents
2. Ensure all naming conventions match
3. Run the app to verify images load correctly

## ⚠️ Troubleshooting

**Images not loading?**
- Check file names match exactly (case-sensitive)
- Verify file extensions (.jpg, .png, .mp4, .svg)
- Check browser console for 404 errors

**Videos not playing?**
- Ensure proper codec (H.264 recommended)
- Check file size (optimize if > 50MB)
- Verify MIME type support
