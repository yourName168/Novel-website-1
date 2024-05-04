import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/httpStatus'
import {
  RegitsterRequestBody
} from '~/models/requests/User.request'
import User from '~/models/schemas/Users.Schema'
import { NovelService } from '~/services/Novels.Services'
import usersService from '~/services/Users.Services'
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string

//Nếu như sử dụng req,res, next trong Router thì không cần khai báo kiểu dữ liệu
// vì trong ngữ cảnh sử dụng Router Typescript tự động hiểu kiểu dữ liệu của của
// còn trong trường hợp này ta tách ra một middleware không có router nên cần gán kiểu
// dữ liệu cho req, res, next để chặt chẽ hơn
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const result = await usersService.login(user)
  return res.status(HTTP_STATUS.APPECTED).json({
    message: 'login success!',
    result
  })
}
export const regitsterController = async (
  req: Request<ParamsDictionary, any, RegitsterRequestBody>,
  //RegitsterRequestBody dùng để gán kiểu cho body gửi lên từ request Regitster
  res: Response,
  next: NextFunction
) => {
  // câu lệnh giúp giả định lỗi để luồng chạy xuống khối catch
  const result = await usersService.regitster(req.body)
  // truyền vào hàm regitster một object do hàm regitster nhận vào payload
  // là object gồm email và password
  return res.status(HTTP_STATUS.CREATED).json({
    message: 'register success!',
    result
  })
}
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}
export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorizarion as JwtPayload
  const result = await usersService.getMe(user_id)
  return res.json(result)
}
export const followNovelController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorizarion as JwtPayload
  const {novelId}=req.body
   await usersService.followNovel(user_id,novelId)
  const result=await NovelService.increaseFollow(novelId)
  return res.json(result)
}
export const unFollowNovelController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorizarion as JwtPayload
  const {novelId}=req.body
   await usersService.unFollowNovel(user_id,novelId)
  const result=await NovelService.decreaseFollow(novelId)
  return res.json(result)
}