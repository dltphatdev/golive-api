import { PREFIX_STEP_LOG } from '@/constants/path'
import { getHistoryStepLogController, getStepsController, updateStepController } from '@/controllers/step.controller'
import { updateStepLogValidator } from '@/middlewares/step.middleware'
import { accessTokenValidator, verifiedUserValidator } from '@/middlewares/user.middleware'
import { wrapRequestHandler } from '@/utils/handler'
import { Router } from 'express'

const stepRouter = Router()

/**
 * Description: Update step log user account
 * Path: /update
 * Method: PUT
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { start_time: string; last_time: string; steps: number }
 * */
stepRouter.put(
  `${PREFIX_STEP_LOG}/update`,
  accessTokenValidator,
  verifiedUserValidator,
  updateStepLogValidator,
  wrapRequestHandler(updateStepController)
)

/**
 * Description: Get today's step summary + streak + last 7 days chart
 * Path: /
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * */
stepRouter.get(PREFIX_STEP_LOG, accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getStepsController))

/**
 * Description: Get history of step log
 * Path: /history
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * */
stepRouter.get(
  `${PREFIX_STEP_LOG}/history-activity`,
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getHistoryStepLogController)
)

export default stepRouter
