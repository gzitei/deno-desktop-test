import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import type { VaccinationData } from '../../../types/VaccinationData.d.ts'
import BaseEntity from '../BaseEntity.ts'

export default class VaccinationEntity extends BaseEntity {
  static override tableName = 'vaccinations'

  petId: bigint
  medicalRecordId: bigint
  description: string
  manufacturer: string
  batch: string
  expirationDate: Temporal.PlainDate

  constructor({
    id,
    petId,
    medicalRecordId,
    description,
    manufacturer,
    batch,
    expirationDate,
    createdAt,
    updatedAt,
  }: VaccinationData) {
    super(id, createdAt, updatedAt)
    this.validateFieldValue(petId, 'petId')
    this.petId = petId
    this.validateFieldValue(medicalRecordId, 'medicalRecordId')
    this.medicalRecordId = medicalRecordId
    this.validateFieldValue(description, 'description')
    this.description = description
    this.validateFieldValue(manufacturer, 'manufacturer')
    this.manufacturer = manufacturer
    this.validateFieldValue(batch, 'batch')
    this.batch = batch
    this.validateFieldValue(expirationDate, 'expirationDate')
    this.expirationDate = expirationDate
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
