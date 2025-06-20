import { CONFIG_ENV } from '@/constants/config'
import crypto from 'node:crypto'
type StringEnumType = {
  [key: string]: string
}

function parseExpiration(exp: string): { value: number; unit: string } {
  const match = exp.match(/^(\d+)([smhdwMy])$/) // s: giây, m: phút, h: giờ, d: ngày, w: tuần, M: tháng, y: năm
  if (!match) {
    throw new Error(`Invalid expiration format: ${exp}`)
  }
  const value = parseInt(match[1], 10)
  const unit = match[2]
  return { value, unit }
}

export const stringEnumToArray = (stringEnum: StringEnumType) => {
  return Object.values(stringEnum).filter((value) => typeof value === 'string') as string[]
}

export function convertToSeconds(exp: string): number {
  const { value, unit } = parseExpiration(exp)

  switch (unit) {
    case 's': // giây
      return value
    case 'm': // phút
      return value * 60
    case 'h': // giờ
      return value * 60 * 60
    case 'd': // ngày
      return value * 24 * 60 * 60
    case 'w': // tuần
      return value * 7 * 24 * 60 * 60
    case 'M': // tháng (ước lượng 30 ngày)
      return value * 30 * 24 * 60 * 60
    case 'y': // năm (ước lượng 365 ngày)
      return value * 365 * 24 * 60 * 60
    default:
      throw new Error(`Unsupported unit: ${unit}`)
  }
}

export function generateRandomUppercaseString(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

function generateRandomDigitString(length = 6) {
  const digits = '0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length)
    result += digits[randomIndex]
  }
  return result
}

export function generateOtp({
  expiresInSec = 300,
  userId = Number(generateRandomDigitString()),
  createdAt = new Date()
}: {
  userId?: number
  createdAt?: Date
  expiresInSec?: number
}): string {
  /**
   * Sinh mã OTP 6 chữ số dựa trên userId, createdAt và thời gian hiện tại
   */
  const timeSlot = Math.floor(Date.now() / 1000 / expiresInSec) // VD: mỗi 5 phút một slot
  const input = `${userId}:${createdAt.toISOString()}:${timeSlot}`
  const hmac = crypto.createHmac('sha256', CONFIG_ENV.OTP_SECRET).update(input).digest('hex')

  const numericCode = parseInt(hmac.slice(-6), 16) % 1000000
  return numericCode.toString().padStart(6, '0')
}
