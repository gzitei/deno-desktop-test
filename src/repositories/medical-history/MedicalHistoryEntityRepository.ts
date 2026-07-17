import { SQLOutputValue } from 'node:sqlite'
import BaseEntityRepository from '../BaseEntityRepository.ts'
import MedicalHistoryEntity from '../../entities/medica-history/MedicalHistoryEntity.ts'
import type { MedicalHistoryEntityData } from '../../../types/entities/medical-history/MedicalHistoryEntityData.ts'

export default class MedicalHistoryEntityRepository
  extends BaseEntityRepository<MedicalHistoryEntity> {
  mapRowToEntity(row: Record<string, SQLOutputValue>): MedicalHistoryEntity {
    const body: Partial<MedicalHistoryEntityData> = {}
    const keys = Object.keys(row) as Array<keyof MedicalHistoryEntity>

    for (const key of keys) {
      if (key === 'petId' || key === 'id') {
        body[key] = BigInt(row[key]!.toString())
      } else if (key === 'updatedAt' || key === 'createdAt') {
        body[key] = Temporal.PlainDateTime.from(row[key]!.toString())
      }
    }

    return new MedicalHistoryEntity(body as MedicalHistoryEntityData)
  }
}
