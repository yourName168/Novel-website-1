import { ObjectId } from 'mongodb'
interface RefreshTokenType {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: string
}
export default class RefreshTokens {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: string
  constructor({ _id, token, created_at = new Date(), user_id }: RefreshTokenType) {
    this.token = token
    this._id = _id
    this.created_at = created_at || new Date().toISOString()
    this.user_id = user_id
  }
}
  