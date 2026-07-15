import InvalidFieldValueException from "../../../exceptions/InvalidFieldValueException.ts"
import type { MedicalHistoryData } from "../../../types/MedicalHistoryData.ts"
import BaseEntity from "../BaseEntity.ts"

export default class MedicalHistoryEntity extends BaseEntity {
  static override tableName = "medical_histories"

  petId: bigint

  constructor({ id, petId, createdAt, updatedAt }: MedicalHistoryData) {
    super(id, createdAt, updatedAt)
    if (petId === null || petId === undefined) {
      throw new InvalidFieldValueException(
        "Field petId is required for MedicalHistory",
      )
    }
    this.petId = petId
  }
}
