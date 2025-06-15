import { Request, Response, NextFunction, RequestHandler } from 'express'

export function wrapRequestHandler<P>(func: RequestHandler<P, any, any, any>) {
  return async function (req: Request<P>, res: Response, next: NextFunction) {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
