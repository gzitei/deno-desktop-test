import { describe, it } from 'node:test'
import { assertEquals } from '@std/assert/equals'
import { assert } from '@std/assert'
import MedicalHistory from '../../../src/models/medical-history/MedicalHistory.ts'

describe('MedicalHistory test', () => {
  it('should instantiate medical history entity from all fields', () => {
    // given
    const id = 123n
    const petId = 10n
    const createdAt = Temporal.PlainDateTime.from('2026-07-14 15:23:12')
    const updatedAt = Temporal.PlainDateTime.from('2026-07-14 15:24:08')

    // when
    const history = new MedicalHistory({
      id,
      petId,
      createdAt,
      updatedAt,
    })

    // then
    assertEquals(history.id, 123n)
    assertEquals(history.petId, 10n)
    assert(
      Temporal.PlainDateTime.compare(
        history.createdAt!,
        Temporal.PlainDateTime.from('2026-07-14 15:23:12'),
      ) === 0,
    )
    assert(
      Temporal.PlainDateTime.compare(
        history.updatedAt!,
        Temporal.PlainDateTime.from('2026-07-14 15:24:08'),
      ) === 0,
    )
  })
})
