import MSG from '@/constants/msg'
import { validate } from '@/utils/validation'
import { checkSchema, ParamSchema } from 'express-validator'

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

const contentSchema: ParamSchema = {
  trim: true,
  isLength: {
    options: {
      max: 2000
    },
    errorMessage: MSG.CONTENT_MAX_LENGTH
  }
}

export const createSupportValidator = validate(
  checkSchema(
    {
      email: emailSchema,
      fullname: {
        ...fullnameSchema,
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
      content: {
        ...contentSchema,
        optional: true
      }
    },
    ['body']
  )
)
