import { TokenPayload } from './models/requests/User.request'
import User from './models/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorizarion?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
