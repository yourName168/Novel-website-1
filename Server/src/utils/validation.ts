import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// can be reused by many routes

// sequential processing, stops running validation chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Lệnh validation.run(req) chạy chuỗi các quy
    //tắc kiểm tra dữ liệu trên yêu cầu req có trong checkSchema
    await validation.run(req)

    //validationResult(req) sẽ trả về kết quả của việc kiểm tra
    //dưới dạng một đối tượng "kết quả kiểm tra".
    const error = validationResult(req)
    // giá trị lưu error object
    if (error.isEmpty()) {
      return next()
      //nếu không có lỗi thì chuyển sang controller
    }
    const errorsObject = error.mapped()
    const entityErrors = new EntityError({
      errors: {}
    })
    for (const key in errorsObject) {
      // lỗi không phải do validate
      const { msg } = errorsObject[key]
      errorsObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENITY) {
        // kiểm tra msg là một ErrorWithStatus
        return next(msg)
      }
      entityErrors.errors[key] = errorsObject[key]
    }
    // kiểm tra có lỗi trong quá trình validate hay không
    next(entityErrors.errors)
  }
}
