import { DatabaseSync } from 'node:sqlite'

import { assert, assertEquals } from '@std/assert'
import { after, afterEach, before, beforeEach, describe, it } from 'node:test'
import MigrationRepository from '../../../../src/db/migrations/repository/MigrationRepository.ts'
import MigrationEntity from '../../../../src/db/migrations/model/MigrationEntity.ts'
import { create } from '@std/fs/unstable-create'

describe('', () => {
  let db: DatabaseSync
  let repository: MigrationRepository
  const table = 'migrations'

  const name = 'v0001_create_users_table.sql'
  const content = `
      CREATE TABLE users IF NOT EXISTS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `
  const hash =
    '345bea22893d37e9d587d7b6bab516bd458cae14c04548335cbd4dbbb5e0cdb4'

  before(() => {
    db = new DatabaseSync(':memory:')
    repository = new MigrationRepository(db, table)
    repository.createMigrationsTable()
  })

  after(() => db.close())

  beforeEach(() => {
    db.exec(`BEGIN;`)
  })

  afterEach(() => {
    db.exec(`ROLLBACK`)
  })

  it(`migrations table should have been created`, () => {
    // when
    const row = db
      .prepare(
        `SELECT EXISTS (
        SELECT 1
        FROM sqlite_master 
        WHERE type = 'table' AND name = 'migrations'
      ) as table_exists;`,
      )
      .get()

    // then
    assert(row)
    assert(row.table_exists === 1, `Migration table should have been created`)
  })

  it('should create a migration', () => {
    // when
    const start = Temporal.Now.zonedDateTimeISO('UTC').round({
      smallestUnit: 'seconds',
      roundingMode: 'floor',
    })
    const created = repository.create({ name, content, hash })
    const end = Temporal.Now.zonedDateTimeISO('UTC').round({
      smallestUnit: 'seconds',
      roundingMode: 'ceil',
    })
    // then
    assert(created.id === 1n)
    assert(created.name === name)
    assert(created.content === content)
    assert(created.hash === hash)
    assert(created.createdAt)
    assert(Temporal.PlainDateTime.compare(start, created.createdAt) <= 0)
    assert(Temporal.PlainDateTime.compare(end, created.createdAt) >= 0)
    assert(created.updatedAt)
    assert(Temporal.PlainDateTime.compare(start, created.updatedAt) <= 0)
    assert(Temporal.PlainDateTime.compare(created.updatedAt, end) <= 0)
  })

  it('should find migration by name', () => {
    // given
    repository.create({
      name: 'my_mock_migration.sql',
      content,
      hash,
    })

    // when
    const found = repository.findMigrationByName('my_mock_migration.sql')

    // then
    assert(found)
    assert(found instanceof MigrationEntity)
    assertEquals(found.id, 1n)
    assertEquals(found.name, 'my_mock_migration.sql')
    assertEquals(found.content, content)
    assertEquals(found.hash, hash)
  })

  it('should return null when migration is not found', () => {
    const found = repository.findMigrationByName(
      'labubu-bobbie-goods-morango-do-amor.sql',
    )
    assertEquals(found, null)
  })
})
