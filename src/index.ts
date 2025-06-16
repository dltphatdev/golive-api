import express from 'express'
import cors from 'cors'
import { initFolder } from '@/utils/file'
import { PrismaClient } from '@prisma/client'
import { PREFIX_API, PREFIX_APP } from '@/constants/path'
import userRouter from '@/routers/user.route'
import { defaultErrorHandler } from '@/middlewares/errors.middleware'
import { CONFIG_ENV } from '@/constants/config'

initFolder()

export const prisma = new PrismaClient()

const port = CONFIG_ENV.PORT || 8080
const app = express()
app.use(
  cors({
    origin: '*',
    credentials: true
  })
)
app.use(express.json())
app.use(`${PREFIX_API}/${PREFIX_APP}`, userRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server API running on ${CONFIG_ENV.STATUS} with port ${port}`)
})
