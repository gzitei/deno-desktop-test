export type MedicalRecordData = {
  id?: bigint
  medicalHistoryId: bigint
  date: Temporal.PlainDateTime
  details: string
  createdAt?: Temporal.PlainDateTime
  updatedAt?: Temporal.PlainDateTime
}
