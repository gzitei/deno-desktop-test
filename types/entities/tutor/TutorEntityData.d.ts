import type { Address } from './Address.d.ts'

export type TutorEntityData = {
  id?: bigint
  name: string
  document: string
  phone: string
  email: string
  address: Address
  debt: number
  createdAt?: Temporal.PlainDateTime
  updatedAt?: Temporal.PlainDateTime
}
