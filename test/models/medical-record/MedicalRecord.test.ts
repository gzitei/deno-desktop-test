import { describe, it } from 'node:test'
import { assertEquals } from '@std/assert/equals'
import { assert } from '@std/assert'
import MedicalRecord from '../../../src/models/medical-record/MedicalRecord.ts'

describe('MedicalRecord test', () => {
  it('should instantiate medical record entity from all fields', () => {
    // given
    const id = 123n
    const medicalHistoryId = 78n
    const date = Temporal.PlainDateTime.from('2026-07-14 16:51:21')
    const details = 'temperatura 98ªC, desnutrido, desidratado, tratamento com soro e terramicina'
    const createdAt = Temporal.PlainDateTime.from('2026-07-14 16:52:31')
    const updatedAt = Temporal.PlainDateTime.from('2026-07-14 17:02:18')

    // when
    const medicalRecord = new MedicalRecord({
      id,
      medicalHistoryId,
      details,
      date,
      createdAt,
      updatedAt,
    })

    // then
    assertEquals(medicalRecord.id, 123n)
    assertEquals(medicalRecord.medicalHistoryId, 78n)
    assertEquals(
      medicalRecord.details,
      'temperatura 98ªC, desnutrido, desidratado, tratamento com soro e terramicina',
    )
    assert(
      Temporal.PlainDateTime.compare(
        medicalRecord.date!,
        Temporal.PlainDateTime.from('2026-07-14 16:51:21'),
      ) === 0,
    )
    assert(
      Temporal.PlainDateTime.compare(
        medicalRecord.createdAt!,
        Temporal.PlainDateTime.from('2026-07-14 16:52:31'),
      ) === 0,
    )
    assert(
      Temporal.PlainDateTime.compare(
        medicalRecord.updatedAt!,
        Temporal.PlainDateTime.from('2026-07-14 17:02:18'),
      ) === 0,
    )
  })
})
