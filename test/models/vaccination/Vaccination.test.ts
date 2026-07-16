import { describe, it } from 'node:test'
import { assertEquals } from '@std/assert/equals'
import type { VaccinationData } from '../../../types/VaccinationData.d.ts'
import Vaccination from '../../../src/models/vaccination/Vaccination.ts'

describe('Vaccination test', () => {
  const getData = (): VaccinationData => ({
    id: 13n,
    petId: 123n,
    medicalRecordId: 245n,
    description: 'Covid 19',
    batch: 'L001-2026',
    manufacturer: 'Astra-Zeneca',
    expirationDate: Temporal.PlainDate.from('2027-01-31'),
    createdAt: Temporal.PlainDateTime.from('2026-07-15 23:16:18'),
    updatedAt: Temporal.PlainDateTime.from('2026-07-16 23:16:18'),
  })

  it('should instantiate with all fields', () => {
    // given
    const data = getData()

    // when
    const vaccination = new Vaccination(data)

    // then
    assertEquals(vaccination.id, 13n)
    assertEquals(vaccination.petId, 123n)
    assertEquals(vaccination.medicalRecordId, 245n)
    assertEquals(vaccination.description, 'Covid 19')
    assertEquals(vaccination.batch, 'L001-2026')
    assertEquals(vaccination.manufacturer, 'Astra-Zeneca')
    assertEquals(
      Temporal.PlainDate.compare(
        vaccination.expirationDate!,
        Temporal.PlainDate.from('2027-01-31'),
      ),
      0,
    )
    assertEquals(
      Temporal.PlainDateTime.compare(
        vaccination.createdAt!,
        Temporal.PlainDateTime.from('2026-07-15 23:16:18'),
      ),
      0,
    )
    assertEquals(
      Temporal.PlainDateTime.compare(
        vaccination.updatedAt!,
        Temporal.PlainDateTime.from('2026-07-16 23:16:18'),
      ),
      0,
    )
  })
})
