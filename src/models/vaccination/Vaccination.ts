import type { VaccinationEntityData } from '../../../types/entities/vaccination/VaccinationEntityData.d.ts'

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
  }: VaccinationEntityData) {
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
