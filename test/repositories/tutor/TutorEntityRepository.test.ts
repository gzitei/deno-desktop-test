import { assert, assertEquals } from '@std/assert'
import { DatabaseSync } from 'node:sqlite'
import { after, afterEach, before, beforeEach, describe, it } from 'node:test'
import TutorEntityRepository from '../../../src/repositories/tutor/TutorEntityRepository.ts'
import { runMigrations } from '../RepositoryTestHelpers.ts'
import TutorEntity from '../../../src/entities/tutors/TutorEntity.ts'

describe('TutorEntityRepository test suite', () => {
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

  const getRepo = () => new TutorEntityRepository(db, TutorEntity.tableName)

  it('should allow for TutorEntity creation', () => {
    // given
    const repo = getRepo()
    const data: Partial<TutorEntity> = {
      name: 'Mariana Zitei Vicente',
      document: '123.456.789-10',
      phone: '16912345678',
      email: 'mariana.zitei@example.com',
      address: {
        street: 'Rua Jorgito Valdivia',
        number: '10',
        complement: 'El Mago',
        neighborhood: 'Palestra Itália',
        city: 'Caicó',
        state: 'Rio Grande do Norte',
        zipCode: '14680-000',
      },
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
    assertEquals(found.name, 'Mariana Zitei Vicente')
    assertEquals(found.document, '123.456.789-10')
    assertEquals(found.phone, '16912345678')
    assertEquals(found.email, 'mariana.zitei@example.com')
    assert(found.address)
    const address = found.address
    assertEquals(address.street, 'Rua Jorgito Valdivia')
    assertEquals(address.number, '10')
    assertEquals(address.complement, 'El Mago')
    assertEquals(address.neighborhood, 'Palestra Itália')
    assertEquals(address.city, 'Caicó')
    assertEquals(address.state, 'Rio Grande do Norte')
    assertEquals(address.zipCode, '14680-000')
    assert(Temporal.PlainDateTime.compare(found.createdAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(found.updatedAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(end, found.createdAt!) >= 0)
    assert(Temporal.PlainDateTime.compare(end, found.updatedAt!) >= 0)
  })
})
