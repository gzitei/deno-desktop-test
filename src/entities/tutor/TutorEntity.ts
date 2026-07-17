import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import type { Address } from '../../../types/entities/tutor/Address.d.ts'
import { TutorEntityData } from '../../../types/entities//tutor/TutorEntityData.d.ts'
import BaseEntity from '../BaseEntity.ts'

export default class TutorEntity extends BaseEntity {
  static override tableName: string = 'tutors'
  name: string
  document: string
  phone: string
  email: string
  address: Address
  debt: number

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
  }: TutorEntityData) {
    super(id, createdAt, updatedAt)
    this.id = id
    this.validateFieldValue(name, 'name')
    this.name = name
    this.validateFieldValue(document, 'document')
    this.document = document
    this.validateFieldValue(phone, 'phone')
    this.phone = phone
    this.validateFieldValue(email, 'email')
    this.email = email
    this.validateAddress(address)
    this.address = address
    this.debt = debt ?? 0
  }

  private validateAddress(address: Partial<Address>) {
    const keys = Object.keys(address) as Array<keyof Address>
    for (const key of keys) {
      if (key !== 'complement' && key !== 'number') {
        this.validateFieldValue(address[key], key)
      }
    }
  }

  private validateFieldValue(value: unknown, fieldName: string) {
    if (
      value === null ||
      value === undefined ||
      value.toString().trim().length === 0
    ) {
      throw new InvalidFieldValueException(
        `Invalid value provided for ${fieldName}: '${value}'`,
      )
    }
  }
}
