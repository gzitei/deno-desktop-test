import type { Breed } from "../../../types/Breed.d.ts"
import type { PetData } from "../../../types/PetData.d.ts"
import type { Species } from "../../../types/Species.d.ts"

export default class Pet {
  id: bigint
  tutorId: bigint
  name: string
  species: Species
  breed: Breed
  birthDate: Temporal.PlainDate
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime

  constructor({
    id,
    tutorId,
    name,
    species,
    breed,
    birthDate,
    createdAt,
    updatedAt,
  }: PetData) {
    this.id = id!
    this.tutorId = tutorId
    this.name = name
    this.species = species
    this.breed = breed
    this.birthDate = birthDate
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
