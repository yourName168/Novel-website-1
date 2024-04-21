import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'

// Dùng để định nghĩa những interface request body gửi lên
export interface RegitsterRequestBody {
  name: string
  email: string
  password: string
  date_of_birth: string
  confirm_password: string
}
export interface LoginRequestBody {
  email: string
  password: string
}
export interface resetPasswordRequestBody {
  password: string
  Authenrization: string
  confirm_password: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
}
export interface updateMyProfileRequestBody {
  name: string
  userName: string
  date_of_birth: string
}
