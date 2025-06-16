import { UPLOAD_IMAGE_DIR } from '@/constants/dir'
import MSG from '@/constants/msg'
import { ServeReqParams } from '@/models/requests/serve.request'
import { Request, Response } from 'express'
import path from 'path'

export const serveImageController = (req: Request<ServeReqParams>, res: Response) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send(MSG.IMAGE_NOT_FOUND)
    }
  })
  return
}
