import MSG from '@/constants/msg'
import { prisma } from '@/index'
import { CreateSupportReqBody } from '@/models/requests/support.request'

class SupportService {
  async create(payload: CreateSupportReqBody) {
    await prisma.support.create({
      data: payload
    })
    return {
      message: MSG.SEND_SUPPORT_SUCCESS
    }
  }
}

const supportService = new SupportService()
export default supportService
