export default abstract class BaseEntity {
  static tableName: string

  id?: bigint
  createdAt?: Temporal.PlainDateTime
  updatedAt?: Temporal.PlainDateTime

  constructor(
    id?: bigint,
    createdAt?: Temporal.PlainDateTime,
    updatedAt?: Temporal.PlainDateTime,
  ) {
    this.id = id
    if (createdAt === undefined || updatedAt === undefined) {
      const now = Temporal.Now.plainDateTimeISO()
      this.createdAt = createdAt ?? now
      this.updatedAt = updatedAt ?? now
    } else {
      this.createdAt = createdAt
      this.updatedAt = updatedAt
    }
  }
}
