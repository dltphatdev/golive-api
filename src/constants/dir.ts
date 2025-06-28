import { isProduction } from '@/constants/config'
import path from 'path'

export const UPLOAD_IMAGE_DIR = path.resolve(isProduction ? '/home/vmadmin/uploads/image' : 'uploads/image')
export const UPLOAD_IMAGES_DIR = path.resolve(isProduction ? '/home/vmadmin/uploads/images' : 'uploads/images')
