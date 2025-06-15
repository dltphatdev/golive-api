// import argv from 'minimist'
// import { config } from 'dotenv'
// import type { StringValue } from 'ms'

// config()

// const options = argv(process.argv.slice(2))
// const isProduction = Boolean(options.production)

// export const CONFIG_ENV = {
//   PORT: process.env.PORT,
//   SERVER_URL: process.env.SERVER_URL as string,
//   CLIENT_URL: process.env.CLIENT_URL as string,
//   STATUS: isProduction ? 'production' : 'development',
//   PASSWORD_SECRET: process.env.PASSWORD_SECRET as string,
//   JWT_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY as StringValue,
//   JWT_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_REFRESH_TOKEN_SECRET_KEY as StringValue,
//   JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue,
//   JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as StringValue
// } as const
