import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS_CODE from '@/constants/httpStatusCode'

import { omit } from 'lodash'
import { ErrorsWithStatus } from '@/models/Error'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err instanceof ErrorsWithStatus) {
      res.status(err.status).json(omit(err, ['status']))
      return
    }
    const finalErr: any = {}
    Object.getOwnPropertyNames(err).forEach((key) => {
      if (!Object.getOwnPropertyDescriptor(err, key)?.configurable || !Object.getOwnPropertyDescriptor(err, key)) {
        return
      }
      finalErr[key] = err[key]
    })
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: finalErr.message,
      error_info: omit(finalErr, ['stack'])
    })
    return
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      error_info: omit(error as any, ['stack'])
    })
    return
  }
}
