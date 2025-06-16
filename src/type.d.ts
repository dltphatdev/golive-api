import { TokenPayLoad } from '@/models/requests/user.request'
import { User } from '@prisma/client'
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: User
    decode_authorization?: TokenPayLoad
    decode_refresh_token?: TokenPayLoad
    decode_forgot_password_token?: TokenPayLoad
    decode_email_verify_token?: TokenPayLoad
    decode_forgot_password_token?: TokenPayLoad
  }
}
