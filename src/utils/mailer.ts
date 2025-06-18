import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { CONFIG_ENV } from '@/constants/config'

type SendMail = {
  email: string
  subject: string
  html: string
}
type MailOptions = Pick<SendMail, 'subject' | 'html'> & {
  from: string
  to: string
}

const htmlverifySendMail = fs.readFileSync(path.resolve('src/templates/mail.html'), 'utf8')

export const sendMail = ({ email, subject, html }: SendMail) => {
  const transporter = nodemailer.createTransport({
    host: CONFIG_ENV.MAIL_HOST,
    port: Number(CONFIG_ENV.MAIL_PORT),
    secure: false, // true for port 465, false for other ports
    auth: {
      user: CONFIG_ENV.MAIL_FROM_ADDRESS,
      pass: CONFIG_ENV.MAIL_PASSWORD
    }
  })

  const mailOptions: MailOptions = {
    from: CONFIG_ENV.MAIL_FROM_ADDRESS,
    to: email,
    subject,
    html
  }
  return transporter.sendMail(mailOptions)
}

export const verifySendMail = ({ email, subject, code }: Pick<SendMail, 'email' | 'subject'> & { code: string }) => {
  const html = htmlverifySendMail
    .replace('{{title}}', 'Thư xác thực đăng ký tài khoản')
    .replace(
      '{{content}}',
      `<p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Golive App</strong>.</p>
        <p>
          Để hoàn tất quá trình đăng ký, vui lòng xác thực địa chỉ email của bạn bằng cách
          nhập mã xác thực phía dưới:
        </p>`
    )
    .replace('{{code}}', code)
  return sendMail({ email, subject, html })
}

export const forgotPasswordSendMail = ({
  email,
  subject,
  token
}: Pick<SendMail, 'email' | 'subject'> & { token: string }) => {
  const html = htmlverifySendMail
    .replace('{{title}}', 'Thư yêu cầu đặt lại mật khẩu')
    .replace(
      '{{content}}',
      `<p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn trên <strong>[Tên Ứng Dụng]</strong>.</p>
    <p>Nếu đó là bạn, vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>`
    )
    .replace('{{link}}', `${CONFIG_ENV.CLIENT_APP_URL}/reset-password?token=${token}`)
  return sendMail({ email, subject, html })
}
