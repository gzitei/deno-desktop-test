import { describe, it } from 'node:test'
import { assertEquals } from '@std/assert/equals'
import type { MedicationData } from '../../../types/MedicationData.ts'
import Medication from '../../../src/models/medication/Medication.ts'

describe('Medication test', () => {
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
    const medication = new Medication(data)

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
})
