import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import {
  RegitsterRequestBody
} from '~/models/requests/User.request'
import User from '~/models/schemas/Users.Schema'
import usersService from '~/services/Users.Services'
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
    message: 'regitster success!',
    result
  })
}
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}