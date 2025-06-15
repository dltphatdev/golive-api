import { TokenType } from '@/constants/enum'
import { JwtPayload } from 'jsonwebtoken'

export interface TokenPayLoad extends JwtPayload {
  user_id: number
  token_type: TokenType
  // verify: UserVerifyStatus
  iat: number
  exp: number
}
