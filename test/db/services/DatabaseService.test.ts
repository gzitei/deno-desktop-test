import os from "node:os"
import { rmSync } from "node:fs"
import { dirname } from "@std/path"
import { after, describe, it } from "node:test"
import { DatabaseSync } from "node:sqlite"
import DatabaseService from "../../../src/db/services/DatabaseService.ts"
import { assertEquals } from "@std/assert/equals"
import { assert } from "@std/assert"

describe("DatabaseService test", () => {
  let db: DatabaseSync
  let directory: string

  after(() => {
    db.close()
    rmSync(directory, { force: true, recursive: true })
  })

  it("should  get DatabaseSync instance", () => {
    // given
    const databasePath = [os.tmpdir(), "paw-system", "test-database.db"]
    const service = new DatabaseService(...databasePath)

    // when
    const filePath = service.getPath()
    db = service.getInstance()
    directory = dirname(filePath)

    // then
    assert(db)
    assert(db instanceof DatabaseSync)
    assertEquals(db.location(), filePath)
  })
})
