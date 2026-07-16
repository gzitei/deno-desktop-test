import assert from 'node:assert'
import { assertEquals } from '@std/assert'
import { join } from '@std/path'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import { DatabaseSync } from 'node:sqlite'
import { after, before, describe, it, mock } from 'node:test'
import MigrationRepository from '../../../../src/db/migrations/repository/MigrationRepository.ts'
import MigrationService from '../../../../src/db/migrations/service/MigrationService.ts'

describe('MigrationService test suite', () => {
  let db: DatabaseSync
  let directory: string
  const pathParts = [os.tmpdir(), 'paw-system']

  const createMigrationFile = (title: string, content: string) => {
    writeFileSync(join(directory, title), content, { encoding: 'utf8' })
  }

  const getMigrationService = (): MigrationService => {
    const repo = new MigrationRepository(db, 'migrations')
    return new MigrationService(repo, ...pathParts)
  }

  before(() => {
    db = new DatabaseSync(process.env.SQLITE_DATABASE_FILENAME!)
    directory = join(pathParts[0], pathParts[1])
    mkdirSync(directory, { recursive: true })

    createMigrationFile(
      'v0001_create_users_table.sql',
      `
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE
        );
      `,
    )

    createMigrationFile(
      'v0002_create_posts_table.sql',
      `
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER REFERENCES users(id),
          title TEXT NOT NULL DEFAULT '',
          body TEXT NOT NULL
        );
      `,
    )

    createMigrationFile(
      'v0003_insert_users.sql',
      `
        INSERT INTO users (name, email) VALUES ('Gustavo Zitei Vicente', 'gustavo@example.com');
        INSERT INTO users (name, email) VALUES ('Zé das Couves', 'ze@example.com');
      `,
    )

    createMigrationFile(
      'v0004_insert_posts.sql',
      `
        INSERT INTO posts (userId, title, body) VALUES (1, 'First Blog Post', 'Welcome to my awesome blog!');
      `,
    )
  })

  after(() => {
    db.close()
    rmSync(directory, { force: true, recursive: true })
  })

  it('should apply migrations', async () => {
    // given
    const service = getMigrationService()

    // when
    await service.applyMigrations()
    const existsQuery = db.prepare(`
      SELECT EXISTS
      (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?) as table_exists;
    `)
    const rowsQuery = (table: string) =>
      db.prepare(`
      SELECT * FROM ${table};
    `)

    const usersTableExists = existsQuery.get(`users`)
    const postsTableExists = existsQuery.get(`posts`)
    const blogsTableExists = existsQuery.get(`blogs`)
    const usersRows = rowsQuery(`users`).all()
    const postsRows = rowsQuery(`posts`).all()

    // then
    assert(usersTableExists)
    assertEquals(Number(usersTableExists!.table_exists), 1)
    assert(postsTableExists)
    assertEquals(Number(postsTableExists!.table_exists), 1)
    assert(blogsTableExists)
    assertEquals(Number(blogsTableExists!.table_exists), 0)
    assert(usersRows)
    assertEquals(usersRows!.length, 2)
    assert(postsRows)
    assertEquals(postsRows!.length, 1)
  })

  it('should skip already applied migrations', async () => {
    // given
    const service = getMigrationService()
    const mocked = mock.method(
      MigrationRepository.prototype,
      'execute',
      () => {},
    )

    // when
    await service.applyMigrations()

    // then
    assertEquals(mocked.mock.callCount(), 0)

    mock.reset()
  })

  it('should throw when applied migration content has changed', async () => {
    // given
    const service = getMigrationService()
    createMigrationFile(
      'v0004_insert_posts.sql',
      `
        INSERT INTO posts (userId, title, body) VALUES (1, 'First Blog Post', 'Welcome to my amazing blog!');
      `,
    )

    // when & then
    try {
      await service.applyMigrations()
    } catch (e) {
      console.log(e)
      assertEquals((e as Error).name, 'AssertionError')
    }
  })
})
