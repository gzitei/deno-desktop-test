import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import type { MedicalRecordData } from '../../../types/MedicalRecord.d.ts'
import BaseEntity from '../BaseEntity.ts'

export default class MedicalRecordEntity extends BaseEntity {
  static override tableName = 'medical_records'

  medicalHistoryId: bigint
  date: Temporal.PlainDateTime
  symptomatology?: string
  anamnesis?: string
  diagnostics?: string

  constructor({
    id,
    medicalHistoryId,
    date,
    symptomatology,
    anamnesis,
    diagnostics,
    createdAt,
    updatedAt,
  }: MedicalRecordData) {
    super(id, createdAt, updatedAt)
    this.validateFieldValue(medicalHistoryId, 'medicalHistoryId')
    this.medicalHistoryId = medicalHistoryId
    this.validateFieldValue(date, 'date')
    this.date = date
    this.validateFields(symptomatology, anamnesis, diagnostics)
    this.symptomatology = symptomatology
    this.anamnesis = anamnesis
    this.diagnostics = diagnostics
  }

  private validateFieldValue(value: unknown, fieldName: string) {
    if (value === null || value === undefined) {
      throw new InvalidFieldValueException(
        `Invalid value provided for ${fieldName}: '${value}'`,
      )
    }
  }

  private validateFields(...values: unknown[]) {
    const allInvalid = values.every(
      (v) => v === null || v === undefined || v.toString().trim().length === 0,
    )
    if (allInvalid) {
      throw new InvalidFieldValueException(
        `At least one field must have value: symptomatology, anamnesis or diagnostics`,
      )
    }
  }
}
