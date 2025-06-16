import { serveImageController } from '@/controllers/serve.controller'
import { Router } from 'express'
const serveRouter = Router()

/**
 * Description: Serve single image route
 * Path: /image/:name
 * Method: GET
 * Request param: { name: string }
 * */
serveRouter.get('/image/:name', serveImageController)

export default serveRouter
