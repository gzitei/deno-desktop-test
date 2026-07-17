import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import type { MedicalHistoryEntityData } from '../../../types/entities/medical-history/MedicalHistoryEntityData.ts'
import BaseEntity from '../BaseEntity.ts'

export default class MedicalHistoryEntity extends BaseEntity {
  static override tableName = 'medical_histories'

  petId: bigint

  constructor({ id, petId, createdAt, updatedAt }: MedicalHistoryEntityData) {
    super(id, createdAt, updatedAt)
    if (petId === null || petId === undefined) {
      throw new InvalidFieldValueException(
        'Field petId is required for MedicalHistory',
      )
    }
    this.petId = petId
  }
}
