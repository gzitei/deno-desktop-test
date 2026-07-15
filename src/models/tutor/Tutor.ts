import type { Address } from "../../../types/Address.d.ts"
import { TutorData } from "../../../types/TutorData.d.ts"

export default class Tutor {
  id: bigint
  name: string
  document: string
  phone: string
  email: string
  address: Address
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime

  constructor({
    id,
    name,
    document,
    phone,
    email,
    address,
    createdAt,
    updatedAt,
  }: TutorData) {
    this.id = id!
    this.name = name
    this.document = document
    this.phone = phone
    this.email = email
    this.address = address
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
