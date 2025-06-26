import { CONFIG_ENV } from '@/constants/config'
import { TokenType } from '@/constants/enum'
import MSG from '@/constants/msg'
import { prisma } from '@/index'
import { RegisterRequestBody, UpdateProfileReqBody } from '@/models/requests/user.request'
import { convertToSeconds, generateOtp } from '@/utils/common'
import { hashPassword } from '@/utils/crypto'
import { signToken, verifyToken } from '@/utils/jwt'
import { forgotPasswordSendMail, verifySendMail } from '@/utils/mailer'
import { UserGender, UserVerifyStatus } from '@prisma/client'

interface IToken {
  user_id: number
  verify: UserVerifyStatus
}

interface SignAccessToken extends Pick<IToken, 'user_id' | 'verify'> {
  remember_me?: boolean
}

interface SignRefreshToken extends Pick<IToken, 'user_id' | 'verify'> {
  exp?: number
}

type SignAccessTokenRefreshToken = Pick<IToken, 'user_id' | 'verify'>

interface Login extends Pick<IToken, 'user_id' | 'verify'> {
  remember_me?: boolean
}

interface ForgotPassword {
  id: number
  email: string
}

interface ResetPassword {
  user_id: number
  password: string
}

type ChangePassword = Pick<ResetPassword, 'user_id' | 'password'>

interface UpdateProfile {
  user_id: number
  payload: UpdateProfileReqBody
}

class UserService {
  private signAccessToken({ user_id, verify, remember_me }: SignAccessToken) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: CONFIG_ENV.JWT_ACCESS_TOKEN_SECRET_KEY,
      options: {
        expiresIn: remember_me ? '7d' : CONFIG_ENV.JWT_ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken({ user_id, verify, exp }: SignRefreshToken) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        privateKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY,
      options: {
        expiresIn: CONFIG_ENV.JWT_REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({ token: refresh_token, secretOrPublicKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY })
  }

  async login({ user_id, verify, remember_me }: Login) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify, remember_me }),
      this.signRefreshToken({ user_id, verify })
    ])
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    const [user] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: user_id
        },
        select: {
          id: true,
          email: true,
          fullname: true,
          verify: true,
          avatar: true,
          address: true,
          phone: true,
          spoint: true,
          date_of_birth: true,
          created_at: true,
          updated_at: true
        }
      }),
      prisma.refreshToken.create({
        data: {
          token: refresh_token,
          iat: new Date(iat * 1000),
          exp: new Date(exp * 1000),
          user_id
        }
      })
    ])

    const expires_access_token = convertToSeconds(CONFIG_ENV.JWT_ACCESS_TOKEN_EXPIRES_IN)
    const expires_refresh_token = convertToSeconds(CONFIG_ENV.JWT_REFRESH_TOKEN_EXPIRES_IN)
    return {
      access_token,
      refresh_token,
      expires_access_token,
      expires_refresh_token,
      user
    }
  }

  async logout(refresh_token: string) {
    await prisma.refreshToken.delete({
      where: {
        token: refresh_token
      }
    })
    return {
      message: MSG.LOGOUT_SUCCESS
    }
  }

  async register(payload: RegisterRequestBody) {
    const verifyCode = generateOtp({})
    await Promise.all([
      prisma.user.create({
        data: {
          fullname: payload.fullname,
          phone: payload.phone,
          gender: payload.gender || UserGender.Male,
          email: payload.email,
          password: hashPassword(payload.password),
          verify_code: verifyCode,
          date_of_birth: new Date(payload.date_of_birth),
          verify: UserVerifyStatus.Unverified
        }
      }),
      verifySendMail({ email: payload.email, subject: `Verify your email`, code: verifyCode as string })
    ])
    return {
      messgae: MSG.REGISTER_SUCCESS
    }
  }

  async checkEmailExisted(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    return Boolean(user)
  }

  async forgotPassword({ id, email }: ForgotPassword) {
    const verifyCode = generateOtp({})
    await Promise.all([
      prisma.user.update({
        data: {
          forgot_password_code: verifyCode,
          updated_at: new Date()
        },
        where: {
          id
        }
      }),
      forgotPasswordSendMail({
        email,
        subject: `Email xác minh lấy lại mật khẩu`,
        code: verifyCode
      })
    ])

    return {
      message: MSG.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword({ user_id, password }: ResetPassword) {
    await prisma.user.update({
      data: {
        forgot_password_code: null,
        password: hashPassword(password)
      },
      where: {
        id: user_id
      }
    })
    return {
      message: MSG.CHANGE_PASSWORD_SUCCESS
    }
  }

  async verifyEmail(user_id: number) {
    await prisma.user.update({
      where: {
        id: user_id
      },
      data: {
        verify: UserVerifyStatus.Verified,
        verify_code: null,
        updated_at: new Date()
      }
    })
    return {
      message: MSG.VERIFY_ACCOUNT_SUCCESS
    }
  }

  async getMe(user_id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id
      },
      select: {
        id: true,
        email: true,
        fullname: true,
        verify: true,
        avatar: true,
        address: true,
        spoint: true,
        phone: true,
        date_of_birth: true,
        created_at: true,
        updated_at: true
      }
    })
    return user
  }

  async refreshToken({
    user_id,
    exp,
    refresh_token,
    verify
  }: {
    user_id: number
    exp: number
    refresh_token: string
    verify: UserVerifyStatus
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({
        user_id,
        verify
      }),
      this.signRefreshToken({ user_id, exp, verify }),
      prisma.refreshToken.delete({
        where: {
          token: refresh_token
        }
      })
    ])
    const decode_refresh_token = await this.decodeRefreshToken(new_refresh_token)
    const [user] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: user_id
        },
        select: {
          id: true,
          email: true,
          fullname: true,
          verify: true,
          avatar: true,
          address: true,
          phone: true,
          date_of_birth: true,
          created_at: true,
          updated_at: true
        }
      }),
      prisma.refreshToken.create({
        data: {
          user_id,
          token: new_refresh_token,
          iat: new Date(decode_refresh_token.iat * 1000),
          exp: new Date(decode_refresh_token.exp * 1000)
        }
      })
    ])

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token,
      user
    }
  }

  async changePassword({ user_id, password }: ChangePassword) {
    await prisma.user.update({
      where: {
        id: user_id
      },
      data: {
        password: hashPassword(password)
      }
    })
    return {
      message: MSG.CHANGE_PASSWORD_SUCCESSS
    }
  }

  async updateProfile({ user_id, payload }: UpdateProfile) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await prisma.user.update({
      where: {
        id: user_id
      },
      data: {
        ..._payload,
        updated_at: new Date()
      },
      select: {
        id: true,
        email: true,
        fullname: true,
        verify: true,
        avatar: true,
        address: true,
        phone: true,
        spoint: true,
        date_of_birth: true,
        created_at: true,
        updated_at: true
      }
    })
    return {
      message: MSG.UPDATE_PROFILE_SUCCESS,
      data: user
    }
  }

  async getListRankSpointUser() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullname: true,
        verify: true,
        avatar: true,
        address: true,
        spoint: true,
        phone: true,
        date_of_birth: true,
        created_at: true,
        updated_at: true
      },
      orderBy: {
        spoint: 'desc'
      },
      take: 10
    })
    return users
  }
}

const userService = new UserService()
export default userService
