import { CONFIG_ENV } from '@/constants/config'
import twilio from 'twilio'

const client = twilio(CONFIG_ENV.TWILIO_ACCOUNT_SID, CONFIG_ENV.TWILIO_AUTH_TOKEN)

export async function sendOTP({
  otp,
  phone,
  bussinessName = 'Golive'
}: {
  phone: string
  otp: string
  bussinessName?: string
}) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await client.messages.create({
      body: `Mã xác thực tài khoản ${bussinessName} của bạn là ${otp}`,
      from: CONFIG_ENV.TWILIO_PHONE_NUMBER,
      to: phone
    })
    if (response.status === 'accepted') {
      return otp
    } else {
      throw new Error('Không thể gửi OTP. Vui lòng thử lại.')
    }
  } catch (error: any) {
    throw error
  }
}
