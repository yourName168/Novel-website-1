import { NextFunction, Request, RequestHandler, Response } from 'express'

export const wrap = (func: RequestHandler) => {
  // nhận vào một function để thực hiện try catch
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // nếu thành công thì trả về một req handler trong hàm route
      await func(req, res, next)
    } catch (error) {
      // nếu dính lỗi thì chuyển sang error handler để xử lý lối
      next(error)
    }
  }
}