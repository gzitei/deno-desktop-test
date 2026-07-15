import type { MedicalRecordData } from '../../../types/MedicalRecordData.d.ts'

export default class MedicalRecord {
  id: bigint
  medicalHistoryId: bigint
  date: Temporal.PlainDateTime
  symptomatology?: string
  anamnesis?: string
  diagnostics?: string
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime

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
    this.id = id!
    this.medicalHistoryId = medicalHistoryId
    this.date = date
    this.symptomatology = symptomatology
    this.anamnesis = anamnesis
    this.diagnostics = diagnostics
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
