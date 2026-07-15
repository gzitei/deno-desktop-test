export type MedicalRecordData =
  & {
    id?: bigint
    medicalHistoryId: bigint
    date: Temporal.PlainDateTime
    symptomatology?: string
    anamnesis?: string
    diagnostics?: string
    createdAt?: Temporal.PlainDateTime
    updatedAt?: Temporal.PlainDateTime
  }
  & (
    { symptomatology: string } | { anamnesis: string } | { diagnostics: string }
  )
