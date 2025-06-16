import fs from 'fs'
import { Request } from 'express'
import path from 'path'

import { CONFIG_ENV } from '@/constants/config'
import { MediaType } from '@/constants/enum'
import { uploadImage } from '@/utils/file'

class MediaService {
  async handleUploadImage(req: Request) {
    const file = await uploadImage(req)
    const filename = file.newFilename
    return {
      url: CONFIG_ENV.SERVER_URL,
      filename,
      type: MediaType.Image
    }
  }
}

const mediaService = new MediaService()
export default mediaService
