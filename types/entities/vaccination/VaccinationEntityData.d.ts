export type VaccinationEntityData = {
  id?: bigint
  petId: bigint
  medicalRecordId: bigint
  description: string
  manufacturer: string
  batch: string
  expirationDate: Temporal.PlainDate
  createdAt?: Temporal.PlainDateTime
  updatedAt?: Temporal.PlainDateTime
}
