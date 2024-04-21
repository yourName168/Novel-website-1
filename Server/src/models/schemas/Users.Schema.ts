import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  username?: string
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
}
export default class User {
  _id: ObjectId
  name: string
  email: string
  date_of_birth: Date
  username: string
  password: string
  created_at: Date
  updated_at: Date
  forgot_password_token: string
  
  email_verify_token: string
  verify: UserVerifyStatus
  constructor(user: UserType) {
    this._id = user._id || new ObjectId()
    this.name = user.name || ' '
    this.email = user.email
    this.date_of_birth = user.date_of_birth || new Date()
    this.username = user.username || ''
    this.password = user.password
    this.created_at = user.created_at || new Date()
    this.updated_at = user.updated_at || new Date()
    this.email_verify_token = user.email_verify_token || ' '
    this.forgot_password_token = user.forgot_password_token || ' '
    this.verify = user.verify || 0
  }
}
