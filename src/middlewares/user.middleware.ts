import { Request, Response, NextFunction } from 'express'
import MSG from '@/constants/msg'
import { prisma } from '@/index'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { validate } from '@/utils/validation'
import { checkSchema, ParamSchema } from 'express-validator'
import { ErrorsWithStatus } from '@/models/Error'
import HTTP_STATUS_CODE from '@/constants/httpStatusCode'
import { verifyToken } from '@/utils/jwt'
import { CONFIG_ENV } from '@/constants/config'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import userService from '@/services/user.service'
import { UserGender, UserVerifyStatus } from '@prisma/client'
import { TokenPayLoad } from '@/models/requests/user.request'
import { stringEnumToArray } from '@/utils/common'

const userGender = stringEnumToArray(UserGender)

const emailSchema: ParamSchema = {
  notEmpty: {
    errorMessage: MSG.EMAIL_IS_REQUIRED
  },
  isString: {
    errorMessage: MSG.EMAIL_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 5,
      max: 160
    },
    errorMessage: MSG.EMAIL_LENGTH
  },
  isEmail: {
    errorMessage: MSG.EMAIL_INVALID
  }
}

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: MSG.PASSWORD_IS_REQUIRED
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 160
    },
    errorMessage: MSG.PASSWORD_LENGTH
  }
}

const fullnameSchema: ParamSchema = {
  isString: {
    errorMessage: MSG.FULLNAME_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 2,
      max: 160
    },
    errorMessage: MSG.FULLNAME_LENGTH
  }
}

const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: MSG.DATE_OF_BIRTH_ISO8601
  }
}

const avatarSchema: ParamSchema = {
  isString: {
    errorMessage: MSG.AVATAR_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 255
    },
    errorMessage: MSG.AVATAR_LENGTH
  }
}

const addressSchema: ParamSchema = {
  isString: {
    errorMessage: MSG.ADDRESS_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 160
    },
    errorMessage: MSG.ADDRESS_LENGTH
  }
}

const phoneSchema: ParamSchema = {
  isString: {
    errorMessage: MSG.PHONE_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 10,
      max: 10
    },
    errorMessage: MSG.PHONE_LENGTH
  }
}

const forgotPasswordCodeSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value, { req }) => {
      if (!value) {
        throw new ErrorsWithStatus({
          message: MSG.FORGOT_PASSWORD_CODE_IS_REQUIRED,
          status: HTTP_STATUS_CODE.UNAUTHORIZED
        })
      }
      try {
        const user = await prisma.user.findFirst({
          where: {
            forgot_password_code: value
          }
        })
        if (user === null) {
          throw new ErrorsWithStatus({
            message: MSG.USER_NOT_FOUND,
            status: HTTP_STATUS_CODE.NOT_FOUND
          })
        }
        if (user.forgot_password_code !== value) {
          throw new ErrorsWithStatus({
            message: MSG.FORGOT_PASSWORD_CODE_INVALID,
            status: HTTP_STATUS_CODE.UNAUTHORIZED
          })
        }
        ;(req as Request).user = user
        return true
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorsWithStatus({
            message: capitalize(error.message),
            status: HTTP_STATUS_CODE.UNAUTHORIZED
          })
        }
        throw error
      }
    }
  }
}

const genderSchema: ParamSchema = {
  notEmpty: {
    errorMessage: MSG.GENDER_IS_REQUIRED
  },
  isIn: {
    options: [userGender],
    errorMessage: MSG.GENDER_INVALID
  }
}

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            try {
              if (!access_token) {
                throw new ErrorsWithStatus({
                  message: MSG.ACCESS_TOKEN_IS_REQUIRED,
                  status: HTTP_STATUS_CODE.UNAUTHORIZED
                })
              }
              const decode_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: CONFIG_ENV.JWT_ACCESS_TOKEN_SECRET_KEY
              })
              ;(req as Request).decode_authorization = decode_authorization
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorsWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS_CODE.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorsWithStatus({
                message: MSG.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS_CODE.UNAUTHORIZED
              })
            }
            try {
              const [decode_refresh_token, refresh_token] = await Promise.all([
                verifyToken({
                  token: value,
                  secretOrPublicKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY
                }),
                prisma.refreshToken.findUnique({
                  where: {
                    token: value
                  },
                  select: {
                    token: true
                  }
                })
              ])

              if (refresh_token === null) {
                throw new ErrorsWithStatus({
                  message: MSG.TOKEN_NOT_FOUND,
                  status: HTTP_STATUS_CODE.NOT_FOUND
                })
              }
              ;(req as Request).decode_refresh_token = decode_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorsWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS_CODE.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = await prisma.user.findUnique({
              where: {
                email: value
              }
            })
            if (user === null) {
              throw new Error(MSG.EMAIL_NOT_EXIST)
            }
            const isValid = await comparePassword(req.body.password, user.password)
            if (!isValid) {
              throw new Error(MSG.EMAIL_OR_PASSWORD_INCORRECT)
            }
            ;(req as Request).user = user
            return true
          }
        }
      },
      password: passwordSchema,
      remember_me: {
        isBoolean: {
          errorMessage: MSG.REMEMBER_ME_IS_BOOLEAN
        },
        toBoolean: true,
        optional: true
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string) => {
            const user = await userService.checkEmailExisted(value)
            if (user) {
              throw new ErrorsWithStatus({
                message: MSG.EMAIL_ALREADY_EXISTS,
                status: HTTP_STATUS_CODE.CONFLICT
              })
            }
            return true
          }
        }
      },
      password: passwordSchema,
      date_of_birth: dateOfBirthSchema,
      gender: genderSchema,
      fullname: fullnameSchema,
      phone: phoneSchema
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = await prisma.user.findUnique({
              where: {
                email: value
              }
            })
            if (!user) {
              throw new Error(MSG.USER_NOT_FOUND)
            }
            ;(req as Request).user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_code: forgotPasswordCodeSchema,
      password: passwordSchema
    },
    ['body']
  )
)

export const verifyUserValidator = validate(
  checkSchema(
    {
      verify_code: {
        isString: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorsWithStatus({
                message: MSG.VERIFY_CODE_IS_REQUIRED,
                status: HTTP_STATUS_CODE.UNAUTHORIZED
              })
            }

            try {
              const user = await prisma.user.findFirst({
                where: {
                  verify_code: value
                }
              })
              if (user === null) {
                throw new Error(MSG.USER_NOT_FOUND)
              }
              ;(req as Request).user = user
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorsWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS_CODE.UNAUTHORIZED
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decode_authorization as TokenPayLoad
  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorsWithStatus({
        message: MSG.VERIFY_USER_INVALID,
        status: HTTP_STATUS_CODE.FORBIDDEN
      })
    )
  }
  next()
}

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        ...passwordSchema,
        custom: {
          options: async (value: string, { req }) => {
            const { user_id } = (req as Request).decode_authorization as TokenPayLoad
            const user = await prisma.user.findUnique({
              where: {
                id: user_id
              }
            })
            if (!user) {
              throw new Error(MSG.USER_NOT_FOUND)
            }
            const isValid = await comparePassword(value, user.password)
            if (!isValid) {
              throw new Error(MSG.OLD_PASSWORD_INCORRECT)
            }
            return true
          }
        }
      },
      password: passwordSchema
    },
    ['body']
  )
)

export const updateProfileValidator = validate(
  checkSchema(
    {
      fullname: {
        ...fullnameSchema,
        optional: true
      },
      avatar: {
        ...avatarSchema,
        optional: true
      },
      gender: {
        ...genderSchema,
        optional: true
      },
      address: {
        ...addressSchema,
        optional: true
      },
      phone: {
        ...phoneSchema,
        optional: true
      },
      date_of_birth: {
        ...dateOfBirthSchema,
        optional: true
      }
    },
    ['body']
  )
)
