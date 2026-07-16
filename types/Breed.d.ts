import type { BREEDS } from '../src/entities/pets/Breeds.ts'

export type Breed = (typeof BREEDS)[number]
