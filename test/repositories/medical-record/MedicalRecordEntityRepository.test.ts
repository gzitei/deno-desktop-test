import { assert, assertEquals } from "@std/assert"
import { after, afterEach, before, beforeEach, describe, it } from "node:test"
import { DatabaseSync } from "node:sqlite"
import { createDummyMedicalHistory, runMigrations } from "../RepositoryTestHelpers.ts"
import MedicalRecordEntityRepository from "../../../src/repositories/medical-record/MedicalRecordEntityRepository.ts"
import MedicalRecordEntity from "../../../src/models/medical-record/MedicalRecordEntity.ts"
import type { MedicalRecordData } from "../../../types/MedicalRecordData.d.ts"

describe("MedicalRecordEntityRepository test suite", () => {
  let db: DatabaseSync

  before(async () => {
    db = new DatabaseSync(":memory:")
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

  const getRepo = () => new MedicalRecordEntityRepository(db, MedicalRecordEntity.tableName)

  it("should allow for MedicalHistoryEntity creation", () => {
    // given
    const history = createDummyMedicalHistory(db)
    const repo = getRepo()
    const data = getData()
    data.medicalHistoryId = history.id!

    // when
    const start = Temporal.Now.zonedDateTimeISO("UTC").round({
      smallestUnit: "seconds",
      roundingMode: "floor",
    })
    const found = repo.create(data as MedicalRecordData)
    const end = Temporal.Now.zonedDateTimeISO("UTC").round({
      smallestUnit: "seconds",
      roundingMode: "ceil",
    })

    // then
    assertEquals(found.id, 1n)
    assertEquals(found.medicalHistoryId, 1n)
    assertEquals(found.symptomatology, "febre")
    assertEquals(found.anamnesis, "está amuadinho, tadinho")
    assertEquals(found.diagnostics, "dodói")
    assertEquals(
      Temporal.PlainDateTime.compare(
        found.date,
        Temporal.PlainDateTime.from("2026-04-27 16:47:13"),
      ),
      0,
    )
    assert(Temporal.PlainDateTime.compare(found.createdAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(found.updatedAt!, start) <= 0)
    assert(Temporal.PlainDateTime.compare(end, found.createdAt!) >= 0)
    assert(Temporal.PlainDateTime.compare(end, found.updatedAt!) >= 0)
  })

  const getData = (): Partial<MedicalRecordData> => ({
    id: 1n,
    date: Temporal.PlainDateTime.from("2026-04-27 16:47:13"),
    symptomatology: "febre",
    anamnesis: "está amuadinho, tadinho",
    diagnostics: "dodói",
  })
})
