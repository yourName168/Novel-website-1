import { createHash } from 'node:crypto'

export function hashPassword(content: string) {
  return createHash('sha3-256')
    .update(content + process.env.PASSWORD_SECRET)
    .digest('hex')
}
