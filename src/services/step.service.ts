import { CONFIG_ENV, STREAK_BONUS } from '@/constants/config'
import { prisma } from '@/index'
import { UpdateStepReqBody } from '@/models/requests/step.request'
import { startOfUTCDate } from '@/utils/common'
import dayjs from 'dayjs'
import { capitalize } from 'lodash'

interface UpdateReqService extends Pick<UpdateStepReqBody, 'steps' | 'last_time' | 'start_time'> {
  user_id: number
}

type GetSteps = Pick<UpdateReqService, 'user_id'>

type GetHistoryLog = Pick<UpdateReqService, 'user_id'>
class StepService {
  private async getCurrentStreakCount(user_id: number) {
    const daysToCheck = 30 // kiểm tra tối đa 30 ngày gần nhất

    // Lấy logs bước chân trong X ngày gần nhất
    const logs = await prisma.stepLog.findMany({
      where: {
        user_id,
        date: {
          gte: startOfUTCDate(
            dayjs()
              .subtract(daysToCheck - 1, 'day')
              .toDate()
          )
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    let streakCount = 0

    for (let i = 0; i < daysToCheck; i++) {
      const checkDate = startOfUTCDate(dayjs().subtract(i, 'day').toDate())
      const log = logs.find((l) => dayjs(l.date).isSame(checkDate, 'day'))
      const isToday = dayjs().isSame(checkDate, 'day')
      // Nếu không có log, nhưng hôm nay → vẫn cho tiếp tục (chưa tính là đứt)
      if (!log) {
        if (isToday) {
          continue // chưa hoàn thành, không tính
        }
        break // không phải hôm nay, mà không có log → đứt
      }

      if (log.steps < 5000) {
        // Nếu là hôm nay mà chưa đủ bước → vẫn tiếp tục
        if (isToday) continue

        break // các ngày cũ mà <5000 là đứt
      }

      streakCount++
    }

    return streakCount
  }

  async update({ user_id, start_time, last_time, steps }: UpdateReqService) {
    const startTimeStep = new Date(start_time)
    const lastTimeStep = new Date(last_time)
    const today = startOfUTCDate()
    const yesterday = startOfUTCDate(dayjs().subtract(1, 'day').toDate())
    let stepLog = await prisma.stepLog.findFirst({
      where: {
        user_id,
        date: today
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
      // Nếu đã có log → cập nhật và step < 5000
      if (steps > stepLog.steps && stepLog.steps < 5000) {
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
    const today = startOfUTCDate()
    const startChartDate = startOfUTCDate(dayjs().subtract(6, 'day').toDate()) // Bắt đầu biểu đồ: 6 ngày trước

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

    // Chuẩn hóa dữ liệu biểu đồ: lấy đủ 7 ngày từ Thứ Hai tuần trước → Chủ nhật tuần trước, dù không có log
    const startOfLastWeek = dayjs().startOf('week').subtract(1, 'week') // Thứ 2 tuần trước
    const chartData = []
    for (let i = 0; i < 7; i++) {
      const date = startOfLastWeek.add(i, 'day')
      const log = chartLogs.find((l) => dayjs(l.date).isSame(date, 'day'))
      const chartValue = Math.min(100, Math.round((log?.steps ?? 0 / 5000) * 100))
      chartData.push({
        date: capitalize(date.format('dddd')),
        steps: log?.steps ?? 0,
        isCompleted: (log?.steps as number) >= Number(CONFIG_ENV.SPOINT_DEFAULT),
        chartValue
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

  async getHistoryLog({ user_id }: GetHistoryLog) {
    const logs = await prisma.stepLog.findMany({
      where: {
        user_id
      },
      select: {
        id: true,
        user_id: true,
        date: true,
        steps: true,
        spoint_earned: true,
        start_time: true,
        last_time: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            spoint: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 10
    })
    return logs
  }
}

const stepService = new StepService()
export default stepService
