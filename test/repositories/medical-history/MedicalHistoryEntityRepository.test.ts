import { assert, assertEquals } from '@std/assert'
import { describe, it, after, before, afterEach, beforeEach } from 'node:test'
import { DatabaseSync } from 'node:sqlite'
import { createDummyPet, runMigrations } from '../RepositoryTestHelpers.ts'
import MedicalHistoryEntityRepository from '../../../src/repositories/medical-history/MedicalHistoryEntityRepository.ts'
import MedicalHistoryEntity from '../../../src/models/medical-history/MedicalHistoryEntity.ts'
import type { MedicalHistoryData } from '../../../types/MedicalHistoryData.ts'

describe('MedicalHistoryEntityRepository test suite', () => {
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

  const getRepo = () =>
    new MedicalHistoryEntityRepository(db, MedicalHistoryEntity.tableName)

  it('should allow for MedicalHistoryEntity creation', () => {
    // given
    const pet = createDummyPet(db)
    const repo = getRepo()
    const data: MedicalHistoryData = {
      petId: pet.id!,
    }

    // when
    const start = Temporal.Now.zonedDateTimeISO('UTC').round({
      smallestUnit: 'seconds',
      roundingMode: 'floor',
    })
    repo.create(data)
    const found = repo.findById(1n)
    const end = Temporal.Now.zonedDateTimeISO('UTC').round({
      smallestUnit: 'seconds',
      roundingMode: 'ceil',
    })

    // then
    assertEquals(found.id, 1n)
    assertEquals(found.petId, 1n)
    assert(Temporal.PlainDateTime.compare(found.createdAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(found.updatedAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(end, found.createdAt!) >= 0)
    assert(Temporal.PlainDateTime.compare(end, found.updatedAt!) >= 0)
  })
})
