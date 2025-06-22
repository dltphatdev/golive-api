import MSG from '@/constants/msg'
import { UpdateStepReqBody } from '@/models/requests/step.request'
import { TokenPayLoad } from '@/models/requests/user.request'
import stepService from '@/services/step.service'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const updateStepController = async (req: Request<ParamsDictionary, any, UpdateStepReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const { steps, start_time, last_time } = req.body
  const result = await stepService.update({ steps, start_time, last_time, user_id })
  res.json({
    message: MSG.UPDATE_STEP_SUCCESS,
    data: result
  })
  return
}

export const getStepsController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const result = stepService.getSteps({ user_id })
  res.json({
    message: MSG.GET_STEP_SUCCESS,
    data: result
  })
  return
}
