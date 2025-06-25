import { CreateSupportReqBody } from '@/models/requests/support.request'
import supportService from '@/services/support.service'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const createSupportController = async (
  req: Request<ParamsDictionary, any, CreateSupportReqBody>,
  res: Response
) => {
  const payload = req.body
  const result = await supportService.create(payload)
  res.json(result)
  return
}
