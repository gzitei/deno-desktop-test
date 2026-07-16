import type { SQLInputValue } from 'node:sqlite'
import type { MedicationData } from '../../../types/MedicationData.ts'
import MedicationEntity from '../../entities/medications/MedicationEntity.ts'
import BaseEntityRepository from '../BaseEntityRepository.ts'

export default class MedicationEntityRepository extends BaseEntityRepository<MedicationEntity> {
  mapRowToEntity(row: Record<string, SQLInputValue>): MedicationEntity {
    const data: Partial<MedicationData> = {}
    const keys = Object.keys(row) as Array<keyof Partial<MedicationEntity>>
    for (const key of keys) {
      const value = row[key]!
      if (key === 'id' || key === 'petId' || key === 'medicalRecordId') {
        data[key] = BigInt(value!.toString())
      } else if (key === 'updatedAt' || key === 'createdAt') {
        ;(data as Record<string, Temporal.PlainDateTime>)[key] = Temporal.PlainDateTime.from(
          row[key]!.toString(),
        )
      } else if (key === 'prescription') {
        data[key] = value.toString() === 'true'
      } else {
        data[key] = value.toString()
      }
    }

    return new MedicationEntity(data as MedicationData)
  }
}
