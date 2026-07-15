import { describe, it } from "node:test"
import MigrationEntity from "../../../../src/db/migrations/model/MigrationEntity.ts"
import { assert, assertThrows } from "@std/assert"
import InvalidFieldValueException from "../../../../exceptions/InvalidFieldValueException.ts"

describe("MigrationEntity test suite", () => {
  // given
  const id = 100n
  const name = "v0001_create_users_table.sql"
  const content = `
      CREATE TABLE users IF NOT EXISTS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `
  const hash = "345bea22893d37e9d587d7b6bab516bd458cae14c04548335cbd4dbbb5e0cdb4"
  const createdAt = Temporal.PlainDateTime.from("2026-07-11T16:25:53")
  const updatedAt = Temporal.PlainDateTime.from("2026-07-12T11:03:48")

  it("should instantiate MigrationEntity from all fiels", () => {
    // when
    const entity: MigrationEntity = new MigrationEntity({
      id,
      name,
      content,
      hash,
      createdAt,
      updatedAt,
    })

    // then
    assert(entity, "Failed to instantiate MigrationEntity from all fields")
    assert(entity.id === id)
    assert(entity.name === name)
    assert(entity.content === content)
    assert(entity.hash === hash)
    assert(entity.createdAt!.equals(createdAt))
    assert(entity.updatedAt!.equals(updatedAt))
  })

  const fields = ["name", "content", "hash"]

  fields.forEach((field, _) => {
    it(`should throw when instantiated with invalid ${field}`, () => {
      //given
      const data = {
        id,
        name,
        content,
        hash,
        createdAt,
        updatedAt,
      }

      // when
      assertThrows(
        () => new MigrationEntity({ ...data, [`${field}`]: null as null }),
        InvalidFieldValueException,
        `Field "${field}" cannot be null, undefined or empty`,
      )

      assertThrows(
        () =>
          new MigrationEntity({
            ...data,
            [`${field}`]: undefined as undefined,
          }),
        InvalidFieldValueException,
        `Field "${field}" cannot be null, undefined or empty`,
      )

      assertThrows(
        () => new MigrationEntity({ ...data, [`${field}`]: `` as string }),
        InvalidFieldValueException,
        `Field "${field}" cannot be null, undefined or empty`,
      )

      assertThrows(
        () => new MigrationEntity({ ...data, [`${field}`]: `   ` as string }),
        InvalidFieldValueException,
        `Field "${field}" cannot be null, undefined or empty`,
      )
    })
  })
})
