import { describe, it } from 'node:test'
import { assertEquals } from '@std/assert/equals'
import { assertThrows } from '@std/assert'
import type { MedicationData } from '../../../types/MedicationData.ts'
import MedicationEntity from '../../../src/entities/medications/MedicationEntity.ts'
import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'

describe('MedicationEntity test', () => {
  const getData = (): MedicationData => ({
    id: 10n,
    petId: 28n,
    medicalRecordId: 45n,
    description: 'Terramicina LA',
    dosage: '10 mg/L',
    quantity: '1.5 mL',
    frequency: '1x por dia',
    prescription: true,
    createdAt: Temporal.PlainDateTime.from('2026-07-15 23:16:18'),
    updatedAt: Temporal.PlainDateTime.from('2026-07-16 23:16:18'),
  })

  it('should instantiate with all fields', () => {
    // given
    const data = getData()

    // when
    const medication = new MedicationEntity(data)

    // then
    assertEquals(medication.id, 10n)
    assertEquals(medication.petId, 28n)
    assertEquals(medication.medicalRecordId, 45n)
    assertEquals(medication.description, 'Terramicina LA')
    assertEquals(medication.dosage, '10 mg/L')
    assertEquals(medication.quantity, '1.5 mL')
    assertEquals(medication.frequency, '1x por dia')
    assertEquals(medication.prescription, true)
    assertEquals(
      Temporal.PlainDateTime.compare(
        medication.createdAt!,
        Temporal.PlainDateTime.from('2026-07-15 23:16:18'),
      ),
      0,
    )
    assertEquals(
      Temporal.PlainDateTime.compare(
        medication.updatedAt!,
        Temporal.PlainDateTime.from('2026-07-16 23:16:18'),
      ),
      0,
    )
  })

  it('frequency and prescription fields should fallback to default values', () => {
    // given
    const data = getData()

    // when
    const medication = new MedicationEntity({
      ...data,
      frequency: undefined,
      prescription: undefined,
    })

    // then
    assertEquals(medication.id, 10n)
    assertEquals(medication.petId, 28n)
    assertEquals(medication.medicalRecordId, 45n)
    assertEquals(medication.description, 'Terramicina LA')
    assertEquals(medication.dosage, '10 mg/L')
    assertEquals(medication.quantity, '1.5 mL')
    assertEquals(medication.frequency, 'once')
    assertEquals(medication.prescription, false)
    assertEquals(
      Temporal.PlainDateTime.compare(
        medication.createdAt!,
        Temporal.PlainDateTime.from('2026-07-15 23:16:18'),
      ),
      0,
    )
    assertEquals(
      Temporal.PlainDateTime.compare(
        medication.updatedAt!,
        Temporal.PlainDateTime.from('2026-07-16 23:16:18'),
      ),
      0,
    )
  })

  const requiredFields: Array<Partial<keyof MedicationData>> = [
    'petId',
    'medicalRecordId',
    'description',
    'dosage',
    'quantity',
  ]

  requiredFields.forEach((field) => {
    it(`should throw when ${field} data is not valid`, () => {
      //given
      const data = getData()

      // when & then
      assertThrows(
        () => new MedicationEntity({ ...data, [field]: null }),
        InvalidFieldValueException,
        `Invalid value provided for ${field}: 'null'`,
      )
      assertThrows(
        () => new MedicationEntity({ ...data, [field]: undefined }),
        InvalidFieldValueException,
        `Invalid value provided for ${field}: 'undefined'`,
      )
      assertThrows(
        () => new MedicationEntity({ ...data, [field]: '  ' }),
        InvalidFieldValueException,
        `Invalid value provided for ${field}: '  '`,
      )
    })
  })
})
