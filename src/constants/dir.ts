import { isProduction } from '@/constants/config'
import path from 'path'

export const UPLOAD_IMAGE_DIR = path.resolve(isProduction ? '/home/goliveprod/uploads/image' : 'uploads/image')
export const UPLOAD_IMAGES_DIR = path.resolve(isProduction ? '/home/goliveprod/uploads/images' : 'uploads/images')
