import { pick } from 'lodash'
import { Request, Response, NextFunction } from 'express'
type Filters<T> = Array<keyof T>

export function filterMiddleware<T>(filters: Filters<T>) {
  return function (req: Request, res: Response, next: NextFunction) {
    req.body = pick(req.body, filters)
    next()
  }
}
