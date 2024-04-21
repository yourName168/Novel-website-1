import dotenv from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import {
  RegitsterRequestBody,
  resetPasswordRequestBody,
  updateMyProfileRequestBody
} from '~/models/requests/User.request'
import RefreshTokens from '~/models/schemas/RefreshToken.Schema'
import User from '~/models/schemas/Users.Schema'
import { hashPassword } from '~/utils/cryto'
import { signToken } from '~/utils/jwt'
import { databaseService } from './database.services'
dotenv.config() //file nào sử dụng process.env thì phải sử dụng hàm config()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
const clientUrl = process.env.CLIENT_URL as string
class UsersService {


  private async signAccessToken(user_id: string, userStatus: UserVerifyStatus) {
    //tạo ra access token
    return await signToken({
      payload: {
        user_id,
        verify: userStatus,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: accessTokenSecret,
      options: {
        expiresIn: '15m'
        // đặt thời gian hết hạn
      }
    })
  }
  private async signRefreshToken(user_id: string, userStatus: UserVerifyStatus) {
    //tạo ra access token
    return await signToken({
      payload: {
        user_id,
        verify: userStatus,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: refreshTokenSecret,
      options: {
        expiresIn: '100d'
      }
    })
  }
  private async signAccessAndRefreshToken(user_id: string, userStatus: UserVerifyStatus) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id as string, userStatus),
      this.signRefreshToken(user_id as string, userStatus)
    ])
    return { access_token, refresh_token }
  }
  async regitster(payload: RegitsterRequestBody) {
    // const result = await databaseService.users.insertOne(
    //   // do insertOne là một Promise nên để thao tác thêm dữ liệu vào DB được hoàn thành
    //   // rồi mới chuyển sang bước tiếp theo nên ta sẽ sử dụng async function
    //   new User({
    //     email,
    //     password
    //   })
    // )
    const _id = new ObjectId()
    const [res] = await Promise.all([
      this.signAccessAndRefreshToken(_id.toString(), 0)
    ])
    console.log(123444)
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id,
        username: `user${_id.toString()}`,
        email_verify_token: '',
        //được sử dụng để truyền toàn bộ các thuộc tính của đối tượng payload
        //vào trong đối tượng User khi bạn tạo một đối tượng mới.
        password: hashPassword(payload.password),
        // mã hóa mật khẩu bằng cryto rồi mới lưu vào db
        date_of_birth: new Date(payload.date_of_birth)
        // chuyển kiểu nhập vào từ string sang lưu ở db là Date
      })
    )
    // send email verify
    // thêm RefreshToken vào trong database
    databaseService.refreshToken.insertOne(new RefreshTokens({ user_id: _id.toString(), token: res.refresh_token }))

    return res
  }
  async login(user: User) {
    try {
      const user_id = user._id as ObjectId
      const userStatus = user.verify
      const result = await this.signAccessAndRefreshToken(user_id.toString(), userStatus)
      await databaseService.refreshToken.insertOne(
        new RefreshTokens({ user_id: user_id.toString(), token: result.refresh_token })
      )
      console.log(123)
      return result.access_token
    } catch (error) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGE.LOGIN_FAIL,
        status: HTTP_STATUS.UNAUTHORIED
      })
    }
  }
  async logout(refresh_token_id: string) {
    databaseService.refreshToken.deleteOne({ token: refresh_token_id })
    return {
      message: USERS_MESSAGE.LOGOUT_SUCCESS
    }
  }
  async verifyEmail(user_id: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: '',
          verify: 1,
          updated_at: new Date()
        }
      }
    )
    return {
      message: USERS_MESSAGE.VERIFY_EMAIL_SUCCESS,
      status: HTTP_STATUS.OK
    }
  }

  async resetPassword(payload: resetPasswordRequestBody, _id: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(payload.password),
          updated_at: new Date()
        }
      }
    )
    return {
      message: USERS_MESSAGE.RESET_PASSWORD_SUCCESS,
      status: HTTP_STATUS.APPECTED
    }
  }
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }
  async updateMyProfile(user_id: string, payload: updateMyProfileRequestBody) {
    const { userName, date_of_birth } = payload
    const DOB = new Date(date_of_birth)
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_payload as updateMyProfileRequestBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        },
        returnDocument: 'after'
      }
    )
    return user.value
  }
  async getProfile(username: string) {
    try {
      const user = await databaseService.users.findOne(
        { username },
        {
          projection: {
            password: 0,
            email_verify_token: 0,
            forgot_password_token: 0,
            verify: 0
          }
        }
      )
      return user
    } catch (error) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
  }
}

const usersService = new UsersService()
export default usersService
