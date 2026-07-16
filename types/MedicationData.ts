export type MedicationData = {
  id?: bigint
  petId: bigint
  medicalRecordId: bigint
  description: string
  dosage: string
  quantity: string
  frequency?: string | 'once'
  prescription?: boolean
  createdAt?: Temporal.PlainDateTime
  updatedAt?: Temporal.PlainDateTime
}
