import { DatabaseSync } from 'node:sqlite'
import type { SQLOutputValue, SQLInputValue } from 'node:sqlite'
import BaseEntity from '../models/BaseEntity.ts'

export default abstract class BaseEntityRepository<T extends BaseEntity> {
  protected readonly db: DatabaseSync
  protected readonly tableName: string

  constructor(db: DatabaseSync, tableName: string) {
    this.db = db
    this.tableName = tableName
  }

  create(data: Partial<T>): T {
    const [keys, values] = this.mapEntityToRow(data)
    const query = this.db.prepare(`
      INSERT INTO ${this.tableName}
      (${keys.join(', ')}) VALUES (${new Array(keys.length).fill('?').join(', ')});
      `)
    const created = query.run(...values)
    const id = created.lastInsertRowid
    return this.findById(BigInt(id))
  }

  mapEntityToRow(data: T | Partial<T>): [string[], SQLInputValue[]] {
    const values: SQLInputValue[] = []
    const keys = Object.keys(data).filter(
      (key) =>
        (data as Record<string, SQLInputValue>)[key] !== undefined &&
        (data as Record<string, SQLInputValue>)[key] !== null,
    )

    for (const key of keys) {
      const value = [Temporal.PlainDate, Temporal.PlainDateTime].some(
        (temporal) =>
          (data as Record<string, SQLInputValue>)[key] instanceof temporal,
      )
        ? (data as Record<string, Temporal.PlainDate | Temporal.PlainDateTime>)
            [key]!.toZonedDateTime(Temporal.Now.timeZoneId())
            .toString()
        : (data as Record<string, SQLInputValue>)[key]

      values.push(value)
    }
    return [keys, values]
  }

  findById(id: bigint): T {
    const query = this.db.prepare(
      `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1;`,
    )
    const row = query.get(id)
    if (!row) {
      throw new Error(
        `Could not find entity id ${id} in table ${this.tableName}`,
      )
    }
    return Object.freeze(this.mapRowToEntity(row))
  }

  listAll(): T[] {
    const query = this.db.prepare(`
      SELECT *
      FROM ${this.tableName};
    `)
    const data = query.all()
    return data.map((row) => Object.freeze(this.mapRowToEntity(row)))
  }

  delete(id: bigint): boolean {
    const query = this.db.prepare(`
      DELETE FROM ${this.tableName}
      WHERE id = ?;
    `)
    const result = query.run(id)
    return result.changes > 0
  }

  update(id: bigint, data: Partial<T>): T {
    if (data.id && data.id !== id) {
      throw new Error(
        `Unable to update entity id ${id} with data from entity id ${data.id}`,
      )
    }
    const { id: _, ...body } = data
    const [keys, values] = this.mapEntityToRow(body as Partial<T>)
    keys.push('updatedAt')
    const query = this.db.prepare(`
      UPDATE ${this.tableName}
      SET ${keys.map((key) => `${key} = ?`).join(', ')}
      WHERE id = ?;
    `)
    const result = query.run(
      ...values,
      Temporal.Now.plainDateTimeISO().toString(),
      id,
    )
    if (result.changes === 0) {
      throw new Error(
        `Unable to update entity id ${id} in table ${this.tableName}`,
      )
    }
    return this.findById(id)
  }

  transaction(fn: () => void): void {
    this.startTransaction()
    try {
      fn()
      this.commitTransaction()
    } catch (e) {
      this.rollbackTransaction()
      throw e
    }
  }

  private startTransaction = () => this.db.exec(`BEGIN;`)

  private commitTransaction = () => this.db.exec(`COMMIT;`)

  private rollbackTransaction = () => this.db.exec(`ROLLBACK;`)

  protected abstract mapRowToEntity(row: Record<string, SQLOutputValue>): T
}
