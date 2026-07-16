import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import type { MedicationData } from '../../../types/MedicationData.ts'
import BaseEntity from '../BaseEntity.ts'

export default class MedicationEntity extends BaseEntity {
  static override tableName = 'medications'

  petId: bigint
  medicalRecordId: bigint
  description: string
  dosage: string
  quantity: string
  frequency?: string | 'once'
  prescription: boolean

  constructor({
    id,
    petId,
    medicalRecordId,
    description,
    dosage,
    quantity,
    frequency,
    prescription,
    createdAt,
    updatedAt,
  }: MedicationData) {
    super(id, createdAt, updatedAt)
    this.validateFieldValue(petId, 'petId')
    this.petId = petId
    this.validateFieldValue(medicalRecordId, 'medicalRecordId')
    this.medicalRecordId = medicalRecordId
    this.validateFieldValue(description, 'description')
    this.description = description
    this.validateFieldValue(dosage, 'dosage')
    this.dosage = dosage
    this.validateFieldValue(quantity, 'quantity')
    this.quantity = quantity
    this.frequency = frequency ?? 'once'
    this.prescription = prescription ?? false
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
