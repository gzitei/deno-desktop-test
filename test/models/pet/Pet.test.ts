import { assertEquals } from '@std/assert'
import { describe, it } from 'node:test'
import { Species } from '../../../types/entities/pet/Species.d.ts'
import type { Breed } from '../../../types/entities/pet/Breed.d.ts'
import Pet from '../../../src/models/pet/Pet.ts'

describe('Pet test', () => {
  it('should instantiate Pet with all fields', () => {
    // given
    const id = 999n
    const name = 'Maria Eduarda'
    const tutorId = 10n
    const species: Species = 'Canina'
    const breed: Breed = 'Shih Tzu'
    const birthDate = Temporal.PlainDate.from('2013-06-28')
    const active = true
    const createdAt = Temporal.PlainDateTime.from('2013-08-10 13:52:18')
    const updatedAt = Temporal.PlainDateTime.from('2026-07-14 09:08:45')

    // when
    const pet = new Pet({
      id,
      name,
      tutorId,
      species,
      breed,
      birthDate,
      active,
      createdAt,
      updatedAt,
    })

    // then
    assertEquals(pet.id, 999n)
    assertEquals(pet.name, 'Maria Eduarda')
    assertEquals(pet.tutorId, 10n)
    assertEquals(pet.species, 'Canina')
    assertEquals(pet.breed, 'Shih Tzu')
    assertEquals(pet.active, true)
    assertEquals(
      Temporal.PlainDate.compare(
        pet.birthDate,
        Temporal.PlainDate.from('2013-06-28'),
      ),
      0,
    )
    assertEquals(
      Temporal.PlainDateTime.compare(
        pet.createdAt,
        Temporal.PlainDateTime.from('2013-08-10 13:52:18'),
      ),
      0,
    )
    assertEquals(
      Temporal.PlainDateTime.compare(
        pet.updatedAt,
        Temporal.PlainDateTime.from('2026-07-14 09:08:45'),
      ),
      0,
    )
  })
})
