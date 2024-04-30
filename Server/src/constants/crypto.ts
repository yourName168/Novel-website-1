
import { createHash } from 'node:crypto'

export function hashPassword(content: string) {
  return createHash('sha256').update(content).digest('hex')
}