import { describe, it } from 'node:test'
import { assertEquals } from '@std/assert/equals'
import { assert, assertThrows } from '@std/assert'
import MedicalRecordEntity from '../../../src/models/medical-record/MedicalRecordEntity.ts'
import type { MedicalRecordData } from '../../../types/MedicalRecordData.d.ts'
import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'

describe('MedicalRecordEntity test', () => {
  it('should instantiate medical history entity from all fields', () => {
    // given
    const id = 123n
    const medicalHistoryId = 78n
    const date = Temporal.PlainDateTime.from('2026-07-14 16:51:21')
    const symptomatology = 'temperatura 98ªC, desnutrido, desidratado'
    const anamnesis =
      'proprietário reporta que o animal está se cagando após comer goiabada'
    const diagnostics = `tá dodói :(
      tadinho...
        vai tomar terramicina LA
      `
    const createdAt = Temporal.PlainDateTime.from('2026-07-14 16:52:31')
    const updatedAt = Temporal.PlainDateTime.from('2026-07-14 17:02:18')

    // when
    const medicalRecord = new MedicalRecordEntity({
      id,
      medicalHistoryId,
      symptomatology,
      anamnesis,
      diagnostics,
      date,
      createdAt,
      updatedAt,
    })

    // then
    assertEquals(medicalRecord.id, 123n)
    assertEquals(medicalRecord.medicalHistoryId, 78n)
    assertEquals(
      medicalRecord.symptomatology!,
      'temperatura 98ªC, desnutrido, desidratado',
    )
    assertEquals(
      medicalRecord.anamnesis!,
      'proprietário reporta que o animal está se cagando após comer goiabada',
    )
    assertEquals(
      medicalRecord.diagnostics!,
      `tá dodói :(
      tadinho...
        vai tomar terramicina LA
      `,
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

  it('should require at least one of symptomatology, anamnesis and diagnostics', () => {
    // given
    const data = getData()

    // when & then
    assertThrows(
      () =>
        new MedicalRecordEntity({
          ...data,
          symptomatology: null as unknown as string,
          anamnesis: undefined as unknown as string,
          diagnostics: '    ',
        } as MedicalRecordData),
      InvalidFieldValueException,
      `At least one field must have value: symptomatology, anamnesis or diagnostics`,
    )
  })

  const getData = (): MedicalRecordData => ({
    id: 1n,
    medicalHistoryId: 10n,
    date: Temporal.Now.plainDateTimeISO(),
    symptomatology: 'febre',
    anamnesis: 'está amuadinho, tadinho',
    diagnostics: 'dodói',
  })
})
