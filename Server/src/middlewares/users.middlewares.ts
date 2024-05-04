import dotenv from 'dotenv'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import User from '~/models/schemas/Users.Schema'
import { databaseService } from '~/services/database.services'
import { hashPassword } from '../utils/cryto'
import { verifyToken } from '../utils/jwt'
dotenv.config() //file nào sử dụng process.env thì phải sử dụng hàm config()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
const usersService = databaseService.users
//Nếu như sử dụng req,res, next trong Router thì không cần khai báo kiểu dữ liệu
// vì trong ngữ cảnh sử dụng Router Typescript tự động hiểu kiểu dữ liệu của của
// còn trong trường hợp này ta tách ra một middleware không có router nên cần gán kiểu
// dữ liệu cho req, res, next để chặt chẽ hơn

export const loginValidator = checkSchema(
  {
    email: {
      isEmail: {
        errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await usersService.findOne({ email: value, password: hashPassword(req.body.password) })
          if (user === null) {
            throw new Error(USERS_MESSAGE.EMAIL_OR_PASSWORD_INCORECT)
          }
          req.user = user as User
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.PASSWORD_IS_REQUIRED
      },
      isStrongPassword: {
        errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRONG
      }
    }
  },
  ['body']
)
// tham số thứ 2 của checkSchema là để xác định vùng kiểm tra schema
// nếu không truyền vào thì sẽ kiểm tra 'body' | 'cookies' | 'headers' | 'params' | 'query'
// từ đó làm ảnh hưởng tới hiệu suất nên chúng ta chỉ check trong body gửi lên là đủ
export const regitsterValidator = checkSchema(
  {
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGE.NAME_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 50
        },
        errorMessage: USERS_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_50
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          const existingEmail = await usersService.findOne({ email: value })
          if (existingEmail !== null) {
            throw new Error(USERS_MESSAGE.EMAIL_ALREADY_EXIST)
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.PASSWORD_IS_REQUIRED
      },
      isStrongPassword: {
        errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.COMFIRM_PASSWORD_IS_REQUIRED
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_SAME_PASSWORD)
          }
          return true
        }
      }
    }
  },
  ['body']
)
export const accessTokenValidator = checkSchema(
  {
    Authorization: {
      custom: {
        options: async (values, { req }) => {
          const access_token = values.split(' ')[1]
          if (access_token === '') {
            throw new ErrorWithStatus({
              message: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIED
            })
          }
          const decoded_authorizarion = await verifyToken({ token: access_token, secretOrPublickey: accessTokenSecret })
          if (decoded_authorizarion === null) {
            throw new Error(USERS_MESSAGE.ACCESS_TOKEN_IS_INVALID)
          }
          req.decoded_authorizarion = decoded_authorizarion
          return true
        }
      }
    }
  },
  ['headers']
)
export const refreshTokenValidator = checkSchema(
  {
    refresh_token: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.REFRESH_TOKEN_IS_REQUIRED
      },
      custom: {
        options: async (value, { req }) => {
          try {
            const [refreshToken] = await Promise.all([
              databaseService.refreshToken.findOne({ token: value }),
              verifyToken({ token: value, secretOrPublickey: refreshTokenSecret })
            ])
            if (refreshToken === null) {
              throw new Error(USERS_MESSAGE.REFRESH_TOKEN_IS_NOT_EXIST)
            }
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGE.REFRESH_TOKEN_IS_INVALID,
                status: HTTP_STATUS.UNAUTHORIED
              })
            }
            throw error
          }

          return true
        }
      }
    }
  },
  ['body']
)


export const emailValidator = checkSchema(
  {
    email: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await usersService.findOne({ email: value })
          if (user === null) {
            throw new Error(USERS_MESSAGE.EMAIL_OR_PASSWORD_INCORECT)
          }
          req.user = user
          return true
        }
      }
    }
  },
  ['body']
)



// kiểm tra xem schema truyền vào có phù hợp hay không
