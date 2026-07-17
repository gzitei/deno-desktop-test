import type { SQLInputValue } from 'node:sqlite'
import BaseEntityRepository from '../BaseEntityRepository.ts'
import VaccinationEntity from '../../entities/vaccination/VaccinationEntity.ts'
import type { VaccinationEntityData } from '../../../types/entities/vaccination/VaccinationEntityData.d.ts'

export default class VaccinationEntityRepository extends BaseEntityRepository<VaccinationEntity> {
  mapRowToEntity(row: Record<string, SQLInputValue>): VaccinationEntity {
    const data: Partial<VaccinationEntityData> = {}
    const keys = Object.keys(row) as Array<keyof Partial<VaccinationEntity>>
    for (const key of keys) {
      const value = row[key]!
      if (key === 'id' || key === 'petId' || key === 'medicalRecordId') {
        data[key] = BigInt(value!.toString())
      } else if (key === 'updatedAt' || key === 'createdAt') {
        ;(data as Record<string, Temporal.PlainDateTime>)[key] = Temporal.PlainDateTime.from(
          row[key]!.toString(),
        )
      } else if (key === 'expirationDate') {
        ;(data as Record<string, Temporal.PlainDate>)[key] = Temporal.PlainDate.from(
          row[key]!.toString(),
        )
      } else {
        data[key] = value.toString()
      }
    }

    return new VaccinationEntity(data as VaccinationEntityData)
  }
}
