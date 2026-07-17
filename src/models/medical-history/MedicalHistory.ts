import type { MedicalHistoryEntityData } from '../../../types/entities/medical-history/MedicalHistoryEntityData.ts'

export default class MedicalHistory {
  id: bigint
  petId: bigint
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime

  constructor({ id, petId, createdAt, updatedAt }: MedicalHistoryEntityData) {
    this.id = id!
    this.petId = petId
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
