import dotenv from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenType } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import {
  RegitsterRequestBody,
  resetPasswordRequestBody
} from '~/models/requests/User.request'
import User from '~/models/schemas/Users.Schema'
import { hashPassword } from '~/utils/cryto'
import { signToken } from '~/utils/jwt'
import { databaseService } from './database.services'
dotenv.config() //file nào sử dụng process.env thì phải sử dụng hàm config()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
const clientUrl = process.env.CLIENT_URL as string
class UsersService {


  private async signAccessToken(user_id: string) {
    //tạo ra access token
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: accessTokenSecret,
      options: {
        expiresIn: '100d'
        // đặt thời gian hết hạn
      }
    })
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
    const res = await this.signAccessToken(_id.toString())
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id,
        username: `user${_id.toString()}`,
        //được sử dụng để truyền toàn bộ các thuộc tính của đối tượng payload
        //vào trong đối tượng User khi bạn tạo một đối tượng mới.
        password: hashPassword(payload.password),
        // mã hóa mật khẩu bằng cryto rồi mới lưu vào db
      })
    )
    // send email verify
    // thêm RefreshToken vào trong database
    return res
  }
  async login(user: User) {
    try {
      const user_id = user._id as ObjectId
      const result = await this.signAccessToken(user_id.toString(),)
      return result
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
  async followNovel(user_id: string, novelId: string) {
    const user = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $push: { following: novelId } }
    )
    return user
  }
  async unFollowNovel(user_id: string, novelId: string) {
    const user = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $pull: { following: novelId } } // Sử dụng $pull để loại bỏ phần tử cụ thể từ mảng
    );
    return user;
  }

}

const usersService = new UsersService()
export default usersService
