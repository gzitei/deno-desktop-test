import type { SQLInputValue, SQLOutputValue } from 'node:sqlite'
import BaseEntityRepository from '../BaseEntityRepository.ts'
import type { Address } from '../../../types/Address.d.ts'
import type { TutorData } from '../../../types/TutorData.d.ts'
import TutorEntity from '../../entities/tutors/TutorEntity.ts'

export default class TutorEntityRepository extends BaseEntityRepository<TutorEntity> {
  override mapEntityToRow(
    entity: TutorEntity | Partial<TutorEntity>,
  ): [string[], SQLInputValue[]] {
    let keys: string[] = []
    let values: SQLInputValue[] = []
    const entityKeys = Object.keys(entity)

    for (const key of entityKeys) {
      if (key === 'address') {
        const addressKeys: string[] = Object.keys(
          entity[key] as Partial<Address>,
        )
        const addressValues: SQLInputValue[] = Object.values(
          entity[key] as Partial<Address>,
        )
        keys = keys.concat(addressKeys)
        values = values.concat(addressValues)
      } else {
        keys.push(key)
        values.push((entity as Record<string, SQLInputValue>)[key])
      }
    }
    return [keys, values]
  }

  mapRowToEntity(row: Record<string, SQLOutputValue>): TutorEntity {
    const ADREES_KEYS: Record<keyof Address, true> = {
      street: true,
      number: true,
      complement: true,
      neighborhood: true,
      city: true,
      state: true,
      zipCode: true,
    }

    const tutorData = {} as TutorData
    const rowKeys = Object.keys(row)
    const address = {} as Address
    for (const key of rowKeys) {
      const value = row[key]
      if ((ADREES_KEYS as Record<string, true>)[key]) {
        ;(address as Record<string, unknown>)[key] = value!.toString()
      } else if (key === 'createdAt' || key === 'updatedAt') {
        tutorData[key] = Temporal.PlainDateTime.from(value!.toString())
      } else if (key === 'id') {
        tutorData[key] = BigInt(value!.toString())
      } else {
        ;(tutorData as Record<string, unknown>)[key] = value!.toString()
      }
    }
    tutorData.address = address as Address

    return new TutorEntity(tutorData)
  }
}
