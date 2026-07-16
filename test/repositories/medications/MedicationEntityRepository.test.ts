import { assert, assertEquals } from '@std/assert'
import { after, afterEach, before, beforeEach, describe, it } from 'node:test'
import { DatabaseSync } from 'node:sqlite'
import { createDummyMedicalRecord, runMigrations } from '../RepositoryTestHelpers.ts'
import MedicationEntityRepository from '../../../src/repositories/medications/MedicationEntityRepository.ts'
import MedicationEntity from '../../../src/entities/medications/MedicationEntity.ts'
import type { MedicationData } from '../../../types/MedicationData.ts'

describe('MedicationEntityRepository test suite', () => {
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

  const getRepo = () => new MedicationEntityRepository(db, MedicationEntity.tableName)

  it('should allow for MedicationEntity creation', () => {
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
    const found = repo.create(data as MedicationData)
    const end = Temporal.Now.zonedDateTimeISO('UTC').round({
      smallestUnit: 'seconds',
      roundingMode: 'ceil',
    })

    // then
    assertEquals(found.id, 1n)
    assertEquals(found.petId, 1n)
    assertEquals(found.medicalRecordId, 1n)
    assertEquals(found.description, 'Terramicina LA')
    assertEquals(found.dosage, '10 mg/L')
    assertEquals(found.quantity, '1.5 mL')
    assertEquals(found.frequency, '1x por dia')
    assertEquals(found.prescription, true)
    assert(Temporal.PlainDateTime.compare(found.createdAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(found.updatedAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(end, found.createdAt!) >= 0)
    assert(Temporal.PlainDateTime.compare(end, found.updatedAt!) >= 0)
  })

  const getData = (): MedicationData => ({
    petId: 1n,
    medicalRecordId: 1n,
    description: 'Terramicina LA',
    dosage: '10 mg/L',
    quantity: '1.5 mL',
    frequency: '1x por dia',
    prescription: true,
  })
})
