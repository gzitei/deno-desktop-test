import BaseEntity from "../../../models/BaseEntity.ts"
import type { MigrationData } from "../../../../types/MigrationData.d.ts"
import InvalidFieldValueException from "../../../../exceptions/InvalidFieldValueException.ts"

export default class MigrationEntity extends BaseEntity {
  static override tableName: string = "migrations"

  readonly name: string
  readonly content: string
  readonly hash: string

  constructor({
    id,
    name,
    content,
    hash,
    createdAt,
    updatedAt,
  }: MigrationData) {
    super(id, createdAt, updatedAt)
    this.validateField(name, 'Field "name" cannot be null, undefined or empty')
    this.name = name
    this.validateField(
      content,
      'Field "content" cannot be null, undefined or empty',
    )
    this.content = content
    this.validateField(hash, 'Field "hash" cannot be null, undefined or empty')
    this.hash = hash
  }

  private validateField(value: string, errorMsg: string) {
    if (value === null || value === undefined) {
      throw new InvalidFieldValueException(errorMsg)
    }
    if (value.trim().length === 0) {
      throw new InvalidFieldValueException(errorMsg)
    }
  }
}
