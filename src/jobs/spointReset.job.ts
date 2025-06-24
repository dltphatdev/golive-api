import cron from 'node-cron'
import { prisma } from '@/index'

cron.schedule('59 23 31 12 *', async () => {
  // Chạy 1 lần duy nhất mỗi năm vào 23 giờ 59 phút ngày 31 tháng 12
  await prisma.user.updateMany({
    data: {
      spoint: {
        multiply: 0.7 // trừ 30%
      }
    }
  })
})
