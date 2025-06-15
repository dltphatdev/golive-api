import express from 'express'
import cors from 'cors'
import { initFolder } from '@/utils/file'
import { PrismaClient } from '@prisma/client'
import { PREFIX_API } from '@/constants/path'
import userRouter from '@/routers/user.route'
import { defaultErrorHandler } from '@/middlewares/errors.middleware'

initFolder()

export const prisma = new PrismaClient()

const port = 9000
const app = express()
app.use(
  cors({
    origin: '*',
    credentials: true
  })
)
app.use(express.json())
app.use(PREFIX_API, userRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Server API running on with port ${port}`)
})
