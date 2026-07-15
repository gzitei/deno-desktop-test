import type { BREEDS } from '../src/models/pet/Breeds.ts'

export type Breed = (typeof BREEDS)[number]
