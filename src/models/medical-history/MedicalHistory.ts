import type { MedicalHistoryData } from "../../../types/MedicalHistoryData.ts"

export default class MedicalHistory {
  id: bigint
  petId: bigint
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime

  constructor({ id, petId, createdAt, updatedAt }: MedicalHistoryData) {
    this.id = id!
    this.petId = petId
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
