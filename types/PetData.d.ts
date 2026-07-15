import type { Breed } from './Breed.d.ts'
import type { Species } from './Species.d.ts'

export type PetData = {
  id?: bigint
  tutorId: bigint
  name: string
  species: Species
  breed: Breed
  birthDate: Temporal.PlainDate
  createdAt?: Temporal.PlainDateTime
  updatedAt?: Temporal.PlainDateTime
}
