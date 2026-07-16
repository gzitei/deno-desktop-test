import { SQLOutputValue } from 'node:sqlite'
import BaseEntityRepository from '../BaseEntityRepository.ts'
import type { MedicalRecordData } from '../../../types/MedicalRecordData.d.ts'
import MedicalRecordEntity from '../../entities/medical-record/MedicalRecordEntity.ts'

export default class MedicalRecordEntityRepository
  extends BaseEntityRepository<MedicalRecordEntity> {
  mapRowToEntity(row: Record<string, SQLOutputValue>): MedicalRecordEntity {
    const body: Partial<MedicalRecordData> = {}
    const keys = Object.keys(row) as Array<keyof MedicalRecordEntity>

    for (const key of keys) {
      if (key === 'medicalHistoryId' || key === 'id') {
        body[key] = BigInt(row[key]!.toString())
      } else if (key === 'updatedAt' || key === 'createdAt' || key === 'date') {
        body[key] = Temporal.PlainDateTime.from(row[key]!.toString())
      } else {
        body[key] = row[key]!.toString()
      }
    }

    return new MedicalRecordEntity(body as MedicalRecordData)
  }
}
