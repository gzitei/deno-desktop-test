import type { MedicationData } from '../../../types/MedicationData.ts'

export default class Medication {
  id: bigint
  petId: bigint
  medicalRecordId: bigint
  description: string
  dosage: string
  quantity: string
  frequency: string | 'once'
  prescription: boolean
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime

  constructor({
    id,
    petId,
    medicalRecordId,
    description,
    dosage,
    quantity,
    frequency,
    prescription,
    createdAt,
    updatedAt,
  }: MedicationData) {
    this.id = id!
    this.petId = petId
    this.medicalRecordId = medicalRecordId
    this.description = description
    this.dosage = dosage
    this.quantity = quantity
    this.frequency = frequency!
    this.prescription = prescription!
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
