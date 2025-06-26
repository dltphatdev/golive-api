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
    secure: true,
    auth: {
      user: CONFIG_ENV.MAIL_USERNAME,
      pass: CONFIG_ENV.MAIL_PASSWORD
    },
    connectionTimeout: 30000,
    socketTimeout: 30000,
    greetingTimeout: 10000,
    requireTLS: true,
    tls: {
      rejectUnauthorized: false
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
  code
}: Pick<SendMail, 'email' | 'subject'> & { code: string }) => {
  const html = htmlverifySendMail
    .replace('{{title}}', 'Thư yêu cầu đặt lại mật khẩu')
    .replace(
      '{{content}}',
      `<p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn trên ứng dụng Golive</strong>.</p>
    <p>Để hoàn tất quá trình, vui lòng nhập mã code phía dưới để xác minh email lấy lại mật khẩu</p>`
    )
    .replace('{{code}}', code)
  return sendMail({ email, subject, html })
}
