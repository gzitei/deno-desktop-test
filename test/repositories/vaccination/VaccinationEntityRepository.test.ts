import { assert, assertEquals } from '@std/assert'
import { after, afterEach, before, beforeEach, describe, it } from 'node:test'
import { DatabaseSync } from 'node:sqlite'
import { createDummyMedicalRecord, runMigrations } from '../RepositoryTestHelpers.ts'
import VaccinationEntityRepository from '../../../src/repositories/vaccination/VaccinationEntityRepository.ts'
import VaccinationEntity from '../../../src/entities/vaccination/VaccinationEntity.ts'
import type { VaccinationEntityData } from '../../../types/entities/vaccination/VaccinationEntityData.d.ts'

describe('VaccinationEntityRepository test suite', () => {
  let db: DatabaseSync

  before(async () => {
    db = new DatabaseSync(process.env.SQLITE_DATABASE_FILENAME!)
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

  const getRepo = () => new VaccinationEntityRepository(db, VaccinationEntity.tableName)

  it('should allow for VaccinationEntity creation', () => {
    // given
    const record = createDummyMedicalRecord(db)
    const repo = getRepo()
    const data = getData()
    data.medicalRecordId = record.id!

    // when
    const start = Temporal.Now.zonedDateTimeISO('UTC').round({
      smallestUnit: 'seconds',
      roundingMode: 'floor',
    })
    const found = repo.create(data as VaccinationEntityData)
    const end = Temporal.Now.zonedDateTimeISO('UTC').round({
      smallestUnit: 'seconds',
      roundingMode: 'ceil',
    })

    // then
    assertEquals(found.id, 1n)
    assertEquals(found.petId, 1n)
    assertEquals(found.medicalRecordId, 1n)
    assertEquals(found.description, 'Covid 19')
    assertEquals(found.batch, 'L001-2026')
    assertEquals(found.manufacturer, 'Astra-Zeneca')
    assert(Temporal.PlainDateTime.compare(found.createdAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(found.updatedAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(end, found.createdAt!) >= 0)
    assert(Temporal.PlainDateTime.compare(end, found.updatedAt!) >= 0)
  })

  const getData = (): VaccinationEntityData => ({
    petId: 1n,
    medicalRecordId: 1n,
    description: 'Covid 19',
    batch: 'L001-2026',
    manufacturer: 'Astra-Zeneca',
    expirationDate: Temporal.PlainDate.from('2027-01-31'),
  })
})
