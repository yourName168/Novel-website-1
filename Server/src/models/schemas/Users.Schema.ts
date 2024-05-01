import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  username?: string
  password: string
  created_at?: Date
  updated_at?: Date
}
export default class User {
  _id: ObjectId
  name: string
  email: string
  username: string
  password: string
  created_at: Date
  updated_at: Date  
  following:string[]
  constructor(user: UserType) {
    this._id = user._id || new ObjectId()
    this.name = user.name || ' '
    this.email = user.email
    this.username = user.username || ''
    this.password = user.password
    this.created_at = user.created_at || new Date()
    this.updated_at = user.updated_at || new Date()
    this.following=[]
  }
}
