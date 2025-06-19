import MSG from '@/constants/msg'
import {
  ChangePasswordReqBody,
  ForgotPasswordReqBody,
  RefreshTokenReqBody,
  RegisterRequestBody,
  ResetPasswordReqBody,
  TokenPayLoad,
  UpdateProfileReqBody,
  UserLoginReqBody,
  UserLogoutReqBody
} from '@/models/requests/user.request'
import mediaService from '@/services/media.service'
import userService from '@/services/user.service'
import { User } from '@prisma/client'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const payload = req.body
  const result = await userService.register(payload)
  res.json({
    message: MSG.REGISTER_SUCCESS,
    data: result
  })
  return
}

export const verifyUserController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { id } = req.user as User
  const result = await userService.verifyEmail(id)
  res.json(result)
  return
}

export const loginController = async (req: Request<ParamsDictionary, any, UserLoginReqBody>, res: Response) => {
  const user = req.user as User
  const result = await userService.login({ user_id: user.id, verify: user.verify })
  res.json({
    message: MSG.LOGIN_SUCCESS,
    data: result
  })
  return
}

export const logoutController = async (req: Request<ParamsDictionary, any, UserLogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  res.json(result)
  return
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const { id, email } = req.user as User
  const result = await userService.forgotPassword({ id, email })
  res.json(result)
  return
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { id } = req.user as User
  const { password } = req.body
  const result = await userService.resetPassword({ user_id: id, password })
  res.json(result)
  return
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const user = await userService.getMe(user_id)
  res.json({
    message: MSG.GET_ME_SUCCESS,
    data: user
  })
  return
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { user_id, exp, verify } = req.decode_refresh_token as TokenPayLoad
  const { refresh_token } = req.body
  const result = await userService.refreshToken({ user_id, refresh_token, exp, verify })
  res.json({
    message: MSG.REFRESH_TOKEN_SUCCESS,
    data: result
  })
  return
}

export const uploadAvatarController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadImage(req)
  res.json({
    message: MSG.UPLOAD_AVATAR_SUCCESSFULLY,
    data: result
  })
  return
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const { password } = req.body
  const result = await userService.changePassword({ user_id, password })
  res.json(result)
  return
}

export const updateProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfileReqBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const payload = req.body
  const result = await userService.updateProfile({ user_id, payload })
  res.json(result)
  return
}
