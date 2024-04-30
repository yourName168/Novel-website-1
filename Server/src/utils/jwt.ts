import jwt from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.request'

export const signToken = async ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: TokenPayload
  privateKey: string
  options?: jwt.SignOptions
}) => {
  return await new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      //payload chứa thông tin của người dùng
      privateKey as string,
      // privateKey chứa khóa bảo mật để tạo jwt lưu trong db
      options as jwt.SignOptions,
      // options là thuật toán sử dụng mã hóa
      (err, token) => {
        if (err) {
          reject(err)
        }
        resolve(token as string)
      }
    )
  })
}

export const verifyToken = ({ token, secretOrPublickey }: { token: string; secretOrPublickey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublickey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      return resolve(decoded as TokenPayload)
    })
  })
}
