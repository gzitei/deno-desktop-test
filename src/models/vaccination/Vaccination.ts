import type { VaccinationData } from '../../../types/VaccinationData.d.ts'

export default class Vaccination {
  id: bigint
  petId: bigint
  medicalRecordId: bigint
  description: string
  manufacturer: string
  batch: string
  expirationDate: Temporal.PlainDate
  createdAt?: Temporal.PlainDateTime
  updatedAt?: Temporal.PlainDateTime

  constructor({
    id,
    petId,
    medicalRecordId,
    description,
    manufacturer,
    batch,
    expirationDate,
    createdAt,
    updatedAt,
  }: VaccinationData) {
    this.id = id!
    this.petId = petId
    this.medicalRecordId = medicalRecordId
    this.description = description
    this.manufacturer = manufacturer
    this.batch = batch
    this.expirationDate = expirationDate
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
