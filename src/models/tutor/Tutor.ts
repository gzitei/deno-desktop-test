import type { Address } from '../../../types/entities/tutor/Address.d.ts'
import type { TutorData } from '../../../types/models/tutor/TutorData.d.ts'

export default class Tutor {
  id: bigint
  name: string
  document: string
  phone: string
  email: string
  address: Address
  debt: number
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime

  constructor({
    id,
    name,
    document,
    phone,
    email,
    address,
    debt,
    createdAt,
    updatedAt,
  }: TutorData) {
    this.id = id!
    this.name = name
    this.document = document
    this.phone = phone
    this.email = email
    this.address = address
    this.debt = debt
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
