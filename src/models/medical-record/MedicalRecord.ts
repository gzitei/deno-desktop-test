import type { MedicalRecordData } from '../../../types/MedicalRecordData.d.ts'

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
  }: MedicalRecordData) {
    this.id = id!
    this.medicalHistoryId = medicalHistoryId
    this.date = date
    this.details = details
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
