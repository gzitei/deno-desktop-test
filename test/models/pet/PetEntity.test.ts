import { assertEquals, assertThrows } from '@std/assert'
import { describe, it } from 'node:test'
import { Species } from '../../../types/Species.d.ts'
import type { Breed } from '../../../types/Breed.d.ts'
import PetEntity from '../../../src/models/pet/PetEntity.ts'
import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'

describe('Pet test', () => {
  it('should instantiate Pet with all fields', () => {
    // given
    const id = 999n
    const name = 'Maria Eduarda'
    const tutorId = 10n
    const species: Species = 'Canina'
    const breed: Breed = 'Shih Tzu'
    const birthDate = Temporal.PlainDate.from('2013-06-28')
    const createdAt = Temporal.PlainDateTime.from('2013-08-10 13:52:18')
    const updatedAt = Temporal.PlainDateTime.from('2026-07-14 09:08:45')

    // when
    const pet = new PetEntity({
      id,
      name,
      tutorId,
      species,
      breed,
      birthDate,
      createdAt,
      updatedAt,
    })

    // then
    assertEquals(pet.id, 999n)
    assertEquals(pet.name, 'Maria Eduarda')
    assertEquals(pet.tutorId, 10n)
    assertEquals(pet.species, 'Canina')
    assertEquals(pet.breed, 'Shih Tzu')
    assertEquals(
      Temporal.PlainDate.compare(
        pet.birthDate,
        Temporal.PlainDate.from('2013-06-28'),
      ),
      0,
    )
    assertEquals(
      Temporal.PlainDateTime.compare(
        pet.createdAt!,
        Temporal.PlainDateTime.from('2013-08-10 13:52:18'),
      ),
      0,
    )
    assertEquals(
      Temporal.PlainDateTime.compare(
        pet.updatedAt!,
        Temporal.PlainDateTime.from('2026-07-14 09:08:45'),
      ),
      0,
    )
  })

  const requiredPetFields = [
    'tutorId',
    'name',
    'species',
    'breed',
    'birthDate',
  ] as Array<Partial<keyof PetEntity>>

  requiredPetFields.forEach((field) => {
    it('required fields should not be null or undefined', () => {
      // given
      const id = 999n
      const name = 'Maria Eduarda'
      const tutorId = 10n
      const species: Species = 'Canina'
      const breed: Breed = 'Shih Tzu'
      const birthDate = Temporal.PlainDate.from('2013-06-28')
      const createdAt = Temporal.PlainDateTime.from('2013-08-10 13:52:18')
      const updatedAt = Temporal.PlainDateTime.from('2026-07-14 09:08:45')

      // when
      const data = {
        id,
        name,
        tutorId,
        species,
        breed,
        birthDate,
        createdAt,
        updatedAt,
      }

      // then
      assertThrows(
        () => new PetEntity({ ...data, [field]: null }),
        InvalidFieldValueException,
        `Invalid value provided for ${field}: 'null'`,
      )

      assertThrows(
        () => new PetEntity({ ...data, [field]: undefined }),
        InvalidFieldValueException,
        `Invalid value provided for ${field}: 'undefined'`,
      )
    })
  })

  it('should require valid species and breed fields', () => {
    // given
    const id = 999n
    const name = 'Maria Eduarda'
    const tutorId = 10n
    const species: Species = 'Canina'
    const breed: Breed = 'Shih Tzu'
    const birthDate = Temporal.PlainDate.from('2013-06-28')

    // when
    const data = {
      id,
      name,
      tutorId,
      species,
      breed,
      birthDate,
    }

    // then
    assertThrows(
      () => new PetEntity({ ...data, breed: 'invalid-breed' as Breed }),
      InvalidFieldValueException,
      `Invalid value provided for breed: 'invalid-breed'`,
    )

    assertThrows(
      () => new PetEntity({ ...data, species: 'invalid-species' as Species }),
      InvalidFieldValueException,
      `Invalid value provided for species: 'invalid-species'`,
    )
  })

  it('should not allow for future birthDate', () => {
    // given
    const id = 999n
    const name = 'Maria Eduarda'
    const tutorId = 10n
    const species: Species = 'Canina'
    const breed: Breed = 'Shih Tzu'
    const birthDate = Temporal.Now.plainDateISO().add(
      Temporal.Duration.from({ days: 1 }),
    )

    // when
    const data = {
      id,
      name,
      tutorId,
      species,
      breed,
      birthDate,
    }

    // then

    assertThrows(
      () => new PetEntity({ ...data }),
      InvalidFieldValueException,
      'Field birthDate cannot be a future date.',
    )
  })
})
