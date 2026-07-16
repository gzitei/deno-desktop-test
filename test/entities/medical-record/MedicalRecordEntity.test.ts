import { describe, it } from 'node:test'
import { assertEquals } from '@std/assert/equals'
import { assert, assertThrows } from '@std/assert'
import type { MedicalRecordData } from '../../../types/MedicalRecordData.d.ts'
import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import MedicalRecordEntity from '../../../src/entities/medical-record/MedicalRecordEntity.ts'

describe('MedicalRecordEntity test', () => {
  it('should instantiate medical history entity from all fields', () => {
    // given
    const id = 123n
    const medicalHistoryId = 78n
    const date = Temporal.PlainDateTime.from('2026-07-14 16:51:21')
    const details = 'temperatura 98ªC, desnutrido, desidratado, tratamento com soro'
    const createdAt = Temporal.PlainDateTime.from('2026-07-14 16:52:31')
    const updatedAt = Temporal.PlainDateTime.from('2026-07-14 17:02:18')

    // when
    const medicalRecord = new MedicalRecordEntity({
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
      'temperatura 98ªC, desnutrido, desidratado, tratamento com soro',
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

  it('should require medicalHistoryId', () => {
    // given
    const data = getData()

    // when & then
    assertThrows(
      () =>
        new MedicalRecordEntity({
          ...data,
          medicalHistoryId: null as unknown as bigint,
        } as MedicalRecordData),
      InvalidFieldValueException,
      `Invalid value provided for medicalHistoryId: 'null'`,
    )

    assertThrows(
      () =>
        new MedicalRecordEntity({
          ...data,
          medicalHistoryId: undefined as unknown as bigint,
        } as MedicalRecordData),
      InvalidFieldValueException,
      `Invalid value provided for medicalHistoryId: 'undefined'`,
    )
  })

  it('should require details', () => {
    // given
    const data = getData()

    // when & then
    assertThrows(
      () =>
        new MedicalRecordEntity({
          ...data,
          details: null as unknown as string,
        } as MedicalRecordData),
      InvalidFieldValueException,
      `Invalid value provided for details: 'null'`,
    )

    assertThrows(
      () =>
        new MedicalRecordEntity({
          ...data,
          details: undefined as unknown as string,
        } as MedicalRecordData),
      InvalidFieldValueException,
      `Invalid value provided for details: 'undefined'`,
    )

    assertThrows(
      () => new MedicalRecordEntity({ ...data, details: '   ' } as MedicalRecordData),
      InvalidFieldValueException,
      `Invalid value provided for details: '   '`,
    )
  })

  const getData = (): MedicalRecordData => ({
    id: 1n,
    medicalHistoryId: 10n,
    date: Temporal.Now.plainDateTimeISO(),
    details: 'febre',
  })
})
