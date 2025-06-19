import { Router } from 'express'
import { PREFIX_USER } from '@/constants/path'
import {
  changePasswordController,
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  updateProfileController,
  uploadAvatarController,
  verifyEmailController
} from '@/controllers/user.controller'
import {
  accessTokenValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateProfileValidator,
  verifiedUserValidator,
  verifyEmailValidator
} from '@/middlewares/user.middleware'
import { wrapRequestHandler } from '@/utils/handler'
import { filterMiddleware } from '@/middlewares/common.middleware'
import { UpdateProfileReqBody } from '@/models/requests/user.request'

const userRouter = Router()

/**
 * Description: Register User Account
 * Method: POST
 * Path: /register
 * Request body: { email: string; password: string; date_of_birth: string; gender: 'Male' | 'Female' }
 * */
userRouter.post(`${PREFIX_USER}/register`, registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Verify user account for send email
 * Path: /verify-email
 * Method: POST
 * Request body: { verify_code: string }
 * */
userRouter.post('/verify-email', verifyEmailValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description: Login User Account
 * Method: POST
 * Path: /login
 * Request body: { email: string; password: string, remember_me?: boolean }
 * */
userRouter.post(`${PREFIX_USER}/login`, loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Logout User Account
 * Method: POST
 * Path: /logout
 * Request body: { refresh_token }
 * */
userRouter.post(`${PREFIX_USER}/logout`, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Forgot Password User Account
 * Path: /forgot-password
 * Method: POST
 * Request Body: { email: string }
 * */
userRouter.post(`${PREFIX_USER}/forgot-password`, forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Reset Password User Account
 * Path: /reset-password
 * Method: POST
 * Request body: { forgot_password_token: string, password: string }
 * */
userRouter.post(`${PREFIX_USER}/reset-password`, resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/*
 * Description: Refresh token when access token is expired
 * Path: /refresh-token
 * Method: POST
 * Request Body: { refresh_token: string }
 */
userRouter.post(`${PREFIX_USER}/refresh-token`, refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description: Get profile account
 * Path: /me
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * */
userRouter.get(`${PREFIX_USER}/me`, accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Upload avatar user account
 * Path: /upload-avatar
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request form data: { image: string }
 * */
userRouter.post(
  `${PREFIX_USER}/upload-avatar`,
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadAvatarController)
)

/**
 * Description: Change password user account
 * Method: PUT
 * Path: /change-password
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { old_password: string; password: string }
 * */
userRouter.put(
  `${PREFIX_USER}/change-password`,
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

/**
 * Description: Update profile user
 * Method: PATCH
 * Path: /profile
 * Request body: { refresh_token }
 * */
userRouter.patch(
  `${PREFIX_USER}/profile`,
  accessTokenValidator,
  verifiedUserValidator,
  updateProfileValidator,
  filterMiddleware<UpdateProfileReqBody>(['address', 'avatar', 'date_of_birth', 'fullname', 'phone']),
  wrapRequestHandler(updateProfileController)
)

export default userRouter
