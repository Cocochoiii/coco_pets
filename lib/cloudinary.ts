import { v2 as cloudinary } from 'cloudinary'

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export default cloudinary

// 文件夹映射
export const UPLOAD_FOLDERS: Record<string, string> = {
  pets: 'coco-pets/pets',
  gallery: 'coco-pets/gallery',
  rooms: 'coco-pets/rooms',
  documents: 'coco-pets/documents',
  general: 'coco-pets/general'
}
