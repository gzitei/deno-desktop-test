export type MigrationData = {
  id: bigint
  name: string
  content: string
  hash: string
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime
}
