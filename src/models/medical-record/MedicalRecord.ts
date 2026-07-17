import type { MedicalRecordEntityData } from '../../../types/entities/medical-record/MedicalRecordEntityData.d.ts'

export default class MedicalRecord {
  id: bigint
  medicalHistoryId: bigint
  date: Temporal.PlainDateTime
  details: string
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime

  constructor({
    id,
    medicalHistoryId,
    date,
    details,
    createdAt,
    updatedAt,
  }: MedicalRecordEntityData) {
    this.id = id!
    this.medicalHistoryId = medicalHistoryId
    this.date = date
    this.details = details
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
