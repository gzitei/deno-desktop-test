import { describe, it } from 'node:test'
import { assertEquals } from '@std/assert/equals'
import { assert, assertThrows } from '@std/assert'
import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import type { MedicalHistoryData } from '../../../types/MedicalHistoryData.ts'
import MedicalHistoryEntity from '../../../src/entities/medica-history/MedicalHistoryEntity.ts'

describe('MedicalHistoryEntity test', () => {
  it('should instantiate medical history entity from all fields', () => {
    // given
    const id = 123n
    const petId = 10n
    const createdAt = Temporal.PlainDateTime.from('2026-07-14 15:23:12')
    const updatedAt = Temporal.PlainDateTime.from('2026-07-14 15:24:08')

    // when
    const entity = new MedicalHistoryEntity({
      id,
      petId,
      createdAt,
      updatedAt,
    })

    // then
    assertEquals(entity.id, 123n)
    assertEquals(entity.petId, 10n)
    assert(
      Temporal.PlainDateTime.compare(
        entity.createdAt!,
        Temporal.PlainDateTime.from('2026-07-14 15:23:12'),
      ) === 0,
    )
    assert(
      Temporal.PlainDateTime.compare(
        entity.updatedAt!,
        Temporal.PlainDateTime.from('2026-07-14 15:24:08'),
      ) === 0,
    )
  })

  it('should require petId', () => {
    assertThrows(
      () => new MedicalHistoryEntity({} as MedicalHistoryData),
      InvalidFieldValueException,
      'Field petId is required for MedicalHistory',
    )
  })
})
