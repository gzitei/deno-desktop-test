import { describe, it } from 'node:test'
import { assertEquals } from '@std/assert/equals'
import type { VaccinationData } from '../../../types/VaccinationData.d.ts'
import VaccinationEntity from '../../../src/entities/vaccination/VaccinationEntity.ts'
import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import { assertThrows } from '@std/assert/throws'

describe('VaccinationEntity test', () => {
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
    const vaccination = new VaccinationEntity(data)

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

  const requiredFields: Array<Partial<keyof VaccinationData>> = [
    'petId',
    'medicalRecordId',
    'description',
    'manufacturer',
    'batch',
    'expirationDate',
  ]

  requiredFields.forEach((field) => {
    it(`should throw when ${field} data is not valid`, () => {
      //given
      const data = getData()

      // when & then
      assertThrows(
        () => new VaccinationEntity({ ...data, [field]: null }),
        InvalidFieldValueException,
        `Invalid value provided for ${field}: 'null'`,
      )
      assertThrows(
        () => new VaccinationEntity({ ...data, [field]: undefined }),
        InvalidFieldValueException,
        `Invalid value provided for ${field}: 'undefined'`,
      )
      assertThrows(
        () => new VaccinationEntity({ ...data, [field]: '  ' }),
        InvalidFieldValueException,
        `Invalid value provided for ${field}: '  '`,
      )
    })
  })
})
