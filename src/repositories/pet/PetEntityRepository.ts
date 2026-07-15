import type { PetData } from '../../../types/PetData.d.ts'
import PetEntity from '../../models/pet/PetEntity.ts'
import BaseEntityRepository from '../BaseEntityRepository.ts'
import type { SQLOutputValue } from 'node:sqlite'

export default class PetEntityRepository extends BaseEntityRepository<PetEntity> {
  mapRowToEntity(row: Record<string, SQLOutputValue>): PetEntity {
    const data: Partial<PetData> = {}
    const keys = Object.keys(row) as Array<keyof PetEntity>

    for (const key of keys) {
      const value = row[key]
      if (key === 'birthDate') {
        data[key] = Temporal.PlainDate.from(value!.toString())
      } else if (key === 'createdAt' || key === 'updatedAt') {
        data[key] = Temporal.PlainDateTime.from(value!.toString())
      } else if (key === 'id' || key === 'tutorId') {
        data[key] = BigInt(value!.toString())
      } else {
        ;(data as Record<string, string>)[key] = value!.toString()
      }
    }
    return new PetEntity(data as PetData)
  }
}
