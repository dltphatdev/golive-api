import { CONFIG_ENV } from '@/constants/config'
import { TokenType } from '@/constants/enum'
import MSG from '@/constants/msg'
import { prisma } from '@/index'
import { RegisterRequestBody, UpdateProfileReqBody } from '@/models/requests/user.request'
import { convertToSeconds, generateRandomDigitString, generateRandomUppercaseString } from '@/utils/common'
import { hashPassword } from '@/utils/crypto'
import { signToken, verifyToken } from '@/utils/jwt'
import { forgotPasswordSendMail, verifySendMail } from '@/utils/mailer'
import { UserGender, UserVerifyStatus } from '@prisma/client'

class UserService {
  private signAccessToken({
    user_id,
    verify,
    remember_me
  }: {
    user_id: number
    verify: UserVerifyStatus
    remember_me?: boolean
  }) {
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

  private signRefreshToken({ user_id, verify, exp }: { user_id: number; verify: UserVerifyStatus; exp?: number }) {
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

  private signAccessTokenRefreshToken({ user_id, verify }: { user_id: number; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({ token: refresh_token, secretOrPublicKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY })
  }

  async login({ user_id, verify, remember_me }: { user_id: number; verify: UserVerifyStatus; remember_me?: boolean }) {
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
    const verifyCode = generateRandomDigitString()
    const user = await prisma.user.create({
      data: {
        fullname: payload.fullname,
        phone: payload.phone,
        gender: payload.gender || UserGender.Male,
        email: payload.email,
        password: hashPassword(payload.password),
        verify_code: verifyCode,
        date_of_birth: payload.date_of_birth,
        verify: UserVerifyStatus.Unverified
      }
    })
    const user_id = user.id

    const [access_token, refresh_token] = await this.signAccessTokenRefreshToken({
      user_id: user_id,
      verify: UserVerifyStatus.Unverified
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await prisma.refreshToken.create({
      data: {
        token: refresh_token,
        iat: new Date(iat * 1000),
        exp: new Date(exp * 1000),
        user_id
      }
    })
    await verifySendMail({ email: payload.email, subject: `Verify your email`, code: user.verify_code as string })
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

  async checkEmailExisted(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    return Boolean(user)
  }

  async forgotPassword({ id, email }: { id: number; email: string }) {
    const verifyCode = generateRandomDigitString()
    await Promise.all([
      prisma.user.update({
        data: {
          forgot_password_code: verifyCode
        },
        where: {
          id,
          updated_at: new Date()
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

  async resetPassword({ user_id, password }: { user_id: number; password: string }) {
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

  async changePassword({ user_id, password }: { user_id: number; password: string }) {
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

  async updateProfile({ user_id, payload }: { user_id: number; payload: UpdateProfileReqBody }) {
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
}

const userService = new UserService()
export default userService
