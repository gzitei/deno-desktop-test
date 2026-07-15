import type { Address } from './Address.d.ts'

export type TutorData = {
  id?: bigint
  name: string
  document: string
  phone: string
  email: string
  address: Address
  createdAt?: Temporal.PlainDateTime
  updatedAt?: Temporal.PlainDateTime
}
