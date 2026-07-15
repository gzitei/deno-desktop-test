import { assert, assertEquals } from '@std/assert'
import { describe, it, after, before, afterEach, beforeEach } from 'node:test'
import { DatabaseSync } from 'node:sqlite'
import PetEntityRepository from '../../../src/repositories/pet/PetEntityRepository.ts'
import type { Species } from '../../../types/Species.d.ts'
import type { Breed } from '../../../types/Breed.d.ts'
import PetEntity from '../../../src/models/pet/PetEntity.ts'
import { createDummyTutor, runMigrations } from '../RepositoryTestHelpers.ts'

describe('PetEntityRepository test suite', () => {
  let db: DatabaseSync

  before(async () => {
    db = new DatabaseSync(':memory:')
    await runMigrations(db)
  })

  after(() => {
    db.close()
  })

  beforeEach(() => {
    db.exec(`BEGIN;`)
  })

  afterEach(() => {
    db.exec(`ROLLBACK;`)
  })

  const getRepo = () => new PetEntityRepository(db, PetEntity.tableName)

  it('should allow for PetEntity creation', () => {
    // given
    const repo = getRepo()
    const name = 'Estrupício Salviano Vicente'
    const { id: tutorId } = createDummyTutor(db)
    const birthDate = Temporal.PlainDate.from('2025-08-16 21:01:12')
    const species: Species = 'Suína'
    const breed: Breed = 'Bichon Frisé'

    // when
    const start = Temporal.Now.zonedDateTimeISO('UTC').round({
      smallestUnit: 'seconds',
      roundingMode: 'floor',
    })
    const created = repo.create({ name, tutorId, birthDate, species, breed })
    const end = Temporal.Now.zonedDateTimeISO('UTC').round({
      smallestUnit: 'seconds',
      roundingMode: 'ceil',
    })

    // then
    assert(created)
    assertEquals(created.id, 1n)
    assertEquals(created.tutorId, 1n)
    assertEquals(created.name, 'Estrupício Salviano Vicente')
    assertEquals(
      Temporal.PlainDate.compare(
        created.birthDate,
        Temporal.PlainDate.from('2025-08-16 21:01:12'),
      ),
      0,
    )
    assertEquals(created.species, 'Suína')
    assertEquals(created.breed, 'Bichon Frisé')
    assert(Temporal.PlainDateTime.compare(start, created.createdAt!) <= 0)
    assert(Temporal.PlainDateTime.compare(end, created.createdAt!) >= 0)
  })
})
