import { PREFIX_SUPPORT } from '@/constants/path'
import { createSupportController } from '@/controllers/support.controller'
import { createSupportValidator } from '@/middlewares/support.middleware'
import { accessTokenValidator, verifiedUserValidator } from '@/middlewares/user.middleware'
import { wrapRequestHandler } from '@/utils/handler'
import { Router } from 'express'

const supportRouter = Router()

/**
 * Description: Create support
 * Method: POST
 * Path: /
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { fullname?: string; email: string; phone?: string; address?: string; content?: string }
 * */
supportRouter.post(
  PREFIX_SUPPORT,
  accessTokenValidator,
  verifiedUserValidator,
  createSupportValidator,
  wrapRequestHandler(createSupportController)
)

export default supportRouter
