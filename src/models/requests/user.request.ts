import { TokenType } from '@/constants/enum'
import { UserVerifyStatus } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'

export interface TokenPayLoad extends JwtPayload {
  user_id: number
  token_type: TokenType
  verify: UserVerifyStatus
  iat: number
  exp: number
}

export interface UserLoginReqBody {
  email: string
  password: string
  remember_me?: boolean
}

export interface UserLogoutReqBody {
  refresh_token: string
}

export interface RegisterRequestBody {
  email: string
  password: string
}

export interface ForgotPasswordReqBody {
  email: string
}
export interface ResetPasswordReqBody {
  forgot_password_token: string
  password: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
}

export interface UpdateProfileReqBody {
  fullname?: string
  avatar?: string
  address?: string
  phone?: string
  date_of_birth?: string
}
