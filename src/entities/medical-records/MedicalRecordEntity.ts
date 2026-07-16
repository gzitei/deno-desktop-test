import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import type { MedicalRecordData } from '../../../types/MedicalRecordData.d.ts'
import BaseEntity from '../BaseEntity.ts'

export default class MedicalRecordEntity extends BaseEntity {
  static override tableName = 'medical_records'

  medicalHistoryId: bigint
  date: Temporal.PlainDateTime
  details: string

  constructor({
    id,
    medicalHistoryId,
    date,
    details,
    createdAt,
    updatedAt,
  }: MedicalRecordData) {
    super(id, createdAt, updatedAt)
    this.validateFieldValue(medicalHistoryId, 'medicalHistoryId')
    this.medicalHistoryId = medicalHistoryId
    this.validateFieldValue(date, 'date')
    this.date = date
    this.validateFieldValue(details, 'details')
    this.details = details
  }

  private validateFieldValue(value: unknown, fieldName: string) {
    if (value === null || value === undefined || value.toString().trim().length === 0) {
      throw new InvalidFieldValueException(
        `Invalid value provided for ${fieldName}: '${value}'`,
      )
    }
  }
}
