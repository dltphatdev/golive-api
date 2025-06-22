import MSG from '@/constants/msg'
import { validate } from '@/utils/validation'
import { checkSchema, ParamSchema } from 'express-validator'

const startTimeLogSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: MSG.START_TIME_STEP_LOG_IS_ISO8601
  }
}

const lastTimeLogSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: MSG.LAST_TIME_STEP_LOG_IS_ISO8601
  }
}

const stepsSchema: ParamSchema = {
  isInt: {
    errorMessage: MSG.STEPS_MUST_BE_INT
  },
  toInt: true,
  custom: {
    options: (value: number) => {
      if (Number(value) < 1) {
        throw new Error(MSG.STEPS_GREATER_THAN_1)
      }
      return true
    }
  }
}

export const updateStepLogValidator = validate(
  checkSchema(
    {
      start_time: startTimeLogSchema,
      last_time: lastTimeLogSchema,
      steps: stepsSchema
    },
    ['body']
  )
)
