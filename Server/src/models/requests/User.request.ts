import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

// Dùng để định nghĩa những interface request body gửi lên
export interface RegitsterRequestBody {
  name: string
  email: string
  password: string
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
}
export interface updateMyProfileRequestBody {
  name: string
  userName: string
  date_of_birth: string
}
