import { CONFIG_ENV, STREAK_BONUS } from '@/constants/config'
import { prisma } from '@/index'
import { UpdateStepReqBody } from '@/models/requests/step.request'
import dayjs from 'dayjs'

interface UpdateReqService extends Pick<UpdateStepReqBody, 'steps' | 'last_time' | 'start_time'> {
  user_id: number
}

type GetSteps = Pick<UpdateReqService, 'user_id'>

class StepService {
  private async getCurrentStreakCount(user_id: number) {
    const today = dayjs().startOf('day')
    const daysToCheck = 30 // kiểm tra tối đa 30 ngày gần nhất

    // Lấy logs bước chân trong X ngày gần nhất
    const logs = await prisma.stepLog.findMany({
      where: {
        user_id,
        date: {
          gte: today.subtract(daysToCheck - 1, 'day').toDate()
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    let streakCount = 0

    for (let i = 0; i < daysToCheck; i++) {
      const checkDate = today.subtract(i, 'day')
      const log = logs.find((l) => dayjs(l.date).isSame(checkDate, 'day'))

      if (!log || log.steps < 5000) {
        break // bị đứt chuỗi
      }

      streakCount++
    }

    return streakCount
  }

  async update({ user_id, start_time, last_time, steps }: UpdateReqService) {
    const startTimeStep = new Date(start_time)
    const lastTimeStep = new Date(last_time)
    const today = dayjs().startOf('day').toDate()
    const yesterday = dayjs().subtract(1, 'day').startOf('day').toDate()
    let stepLog = await prisma.stepLog.findUnique({
      where: {
        user_id_date: {
          user_id,
          date: today
        }
      }
    })

    // Nếu chưa có log → tạo mới
    if (!stepLog) {
      stepLog = await prisma.stepLog.create({
        data: {
          user_id,
          date: today,
          steps,
          start_time: startTimeStep,
          last_time: lastTimeStep,
          spoint_earned: 0
        }
      })
    } else {
      // Nếu đã có log → cập nhật
      stepLog = await prisma.stepLog.update({
        where: {
          user_id_date: {
            user_id,
            date: today
          }
        },
        data: {
          steps,
          start_time: stepLog.start_time ?? startTimeStep, // chỉ ghi start_time nếu chưa có
          last_time: lastTimeStep
        }
      })
    }

    let totalSpoint = 0
    // Nếu đủ 5000 bước và chưa cộng Spoint (chỉ được cộng )
    if (steps >= Number(CONFIG_ENV.SPOINT_DEFAULT) && stepLog.spoint_earned === 0) {
      await prisma.$transaction([
        prisma.stepLog.update({
          where: {
            user_id_date: {
              user_id,
              date: today
            }
          },
          data: {
            spoint_earned: Number(CONFIG_ENV.SPOINT_DEFAULT)
          }
        }),
        prisma.user.update({
          where: {
            id: user_id
          },
          data: {
            spoint: {
              increment: Number(CONFIG_ENV.SPOINT_DEFAULT)
            }
          }
        })
      ])
      totalSpoint += 5000

      // Xử lý chuỗi ngày liên tiếp
      const yesterdayStreak = await prisma.streakLog.findFirst({
        where: { user_id, last_date: yesterday }
      })

      const yesterdayStep = await prisma.stepLog.findUnique({
        where: {
          user_id_date: {
            user_id,
            date: yesterday
          }
        }
      })

      // Kiểm tra sự tồn tại chuỗi ngày, sự tồn tại của log bước đi của ngày hôm qua và số bước phải >= 5000 mới tiến hành + chuỗi
      if (yesterdayStreak && yesterdayStep && yesterdayStep.steps >= Number(CONFIG_ENV.SPOINT_DEFAULT)) {
        const newCount = yesterdayStreak.count + 1
        const streakId = yesterdayStreak.id
        await prisma.streakLog.update({
          where: { id: streakId },
          data: {
            count: newCount,
            last_date: today
          }
        })

        // Nếu đạt mốc thành tích thì thưởng spoint
        if (STREAK_BONUS[newCount]) {
          const bonus = STREAK_BONUS[newCount]
          await prisma.user.update({
            where: { id: user_id },
            data: { spoint: { increment: bonus } }
          })
          totalSpoint += bonus
        }
      } else {
        // Tạo chuỗi mới khi bị đứt đoạn chuỗi
        await prisma.streakLog.create({
          data: {
            user_id,
            start_date: today,
            last_date: today,
            count: 1
          }
        })
      }
    }

    return totalSpoint
  }

  async getSteps({ user_id }: GetSteps) {
    const today = dayjs().startOf('day').toDate()
    const startChartDate = dayjs().subtract(6, 'day').startOf('day').toDate() // Bắt đầu biểu đồ: 6 ngày trước

    // - Log bước chân hôm nay
    // - Chuỗi ngày streak
    // - Log 7 ngày gần nhất
    const [stepLogToday, lastStreakCount, chartLogs] = await Promise.all([
      prisma.stepLog.findUnique({
        where: {
          user_id_date: {
            user_id,
            date: today
          }
        }
      }),
      this.getCurrentStreakCount(user_id),
      prisma.stepLog.findMany({
        where: {
          user_id,
          date: {
            gte: startChartDate
          }
        },
        orderBy: {
          date: 'asc'
        }
      })
    ])

    // Chuẩn hóa dữ liệu biểu đồ: luôn đủ 7 ngày, dù không có log
    const chartData = []
    for (let i = 0; i < 7; i++) {
      const date = dayjs()
        .subtract(6 - i, 'day')
        .startOf('day')
      const log = chartLogs.find((l) => dayjs(l.date).isSame(date, 'day'))
      chartData.push({
        date: date.format('YYYY-MM-DD'),
        steps: log?.steps ?? 0,
        isCompleted: (log?.steps as number) >= Number(CONFIG_ENV.SPOINT_DEFAULT)
      })
    }

    return {
      stepLogToday: {
        steps: stepLogToday?.steps ?? 0,
        spoint_earned: stepLogToday?.spoint_earned ?? 0
      },
      chartData,
      lastStreakCount
    }
  }
}

const stepService = new StepService()
export default stepService
