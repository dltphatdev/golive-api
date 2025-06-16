import argv from 'minimist'
import { config } from 'dotenv'
import type { StringValue } from 'ms'

config()

const options = argv(process.argv.slice(2))
const isProduction = Boolean(options.production)

export const CONFIG_ENV = {
  PORT: process.env.PORT,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS as string,
  SERVER_URL: process.env.SERVER_URL as string,
  CLIENT_APP_URL: process.env.CLIENT_APP_URL as string,
  STATUS: isProduction ? 'production' : 'development',
  PASSWORD_SECRET: process.env.PASSWORD_SECRET as string,
  JWT_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY as StringValue,
  JWT_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_REFRESH_TOKEN_SECRET_KEY as StringValue,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as StringValue,
  JWT_EMAIL_VERIFY_TOKEN_SECRET_KEY: process.env.JWT_EMAIL_VERIFY_TOKEN_SECRET_KEY as StringValue,
  JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY as StringValue,
  JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN: process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue,
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue
} as const
