import type { Breed } from '../../../types/entities/pet/Breed.d.ts'
import type { PetEntityData } from '../../../types/entities/pet/PetEntityData.d.ts'
import type { Species } from '../../../types/entities/pet/Species.d.ts'

export default class Pet {
  id: bigint
  tutorId: bigint
  name: string
  species: Species
  breed: Breed
  birthDate: Temporal.PlainDate
  active: boolean
  createdAt: Temporal.PlainDateTime
  updatedAt: Temporal.PlainDateTime

  constructor({
    id,
    tutorId,
    name,
    species,
    breed,
    birthDate,
    active,
    createdAt,
    updatedAt,
  }: PetEntityData) {
    this.id = id!
    this.tutorId = tutorId
    this.name = name
    this.species = species
    this.breed = breed
    this.birthDate = birthDate
    this.active = active!
    this.createdAt = createdAt!
    this.updatedAt = updatedAt!
  }
}
