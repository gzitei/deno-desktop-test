import BaseEntityRepository from "../../../repositories/BaseEntityRepository.ts"
import MigrationEntity from "../model/MigrationEntity.ts"
import type { MigrationData } from "../../../../types/MigrationData.d.ts"
import type { SQLOutputValue } from "node:sqlite"
import { DatabaseSync } from "node:sqlite"

export default class MigrationRepository extends BaseEntityRepository<MigrationEntity> {
  constructor(db: DatabaseSync, tableName: string) {
    super(db, tableName)
  }

  createMigrationsTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        content TEXT,
        hash TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
   `)
  }

  findMigrationByName(name: string): MigrationEntity | null {
    const query = this.db.prepare(`
      SELECT * 
      FROM ${this.tableName}
      WHERE name = ?;
    `)
    const row = query.get(name)
    if (!row) {
      return null
    }
    return this.mapRowToEntity(row)
  }

  execute(sql: string) {
    this.db.exec(sql)
  }

  protected mapRowToEntity(
    row: Record<string, SQLOutputValue>,
  ): MigrationEntity {
    const migrationData: MigrationData = {
      id: BigInt(row["id"] as string),
      name: row["name"]! as string,
      content: row["content"]! as string,
      hash: row["hash"]! as string,
      createdAt: Temporal.PlainDateTime.from(row["createdAt"]!.toString()),
      updatedAt: Temporal.PlainDateTime.from(row["updatedAt"]!.toString()),
    }
    return new MigrationEntity(migrationData)
  }
}
