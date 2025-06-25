import express from 'express'
import cors from 'cors'
import { initFolder } from '@/utils/file'
import { PrismaClient } from '@prisma/client'
import { PREFIX_API } from '@/constants/path'
import userRouter from '@/routers/user.route'
import { defaultErrorHandler } from '@/middlewares/errors.middleware'
import { CONFIG_ENV } from '@/constants/config'
import stepRouter from '@/routers/step.route'
import '@/jobs/spointReset.job'
import serveRouter from '@/routers/serve.route'

initFolder()

export const prisma = new PrismaClient()

const port = CONFIG_ENV.PORT || 9000
const app = express()
app.use(
  cors({
    origin: '*',
    credentials: true
  })
)
app.use(express.json())
app.use(`${PREFIX_API}`, userRouter)
app.use(`${PREFIX_API}`, stepRouter)
app.use('', serveRouter)
app.use(defaultErrorHandler)

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server API running on ${CONFIG_ENV.STATUS} with port ${port}`)
})
