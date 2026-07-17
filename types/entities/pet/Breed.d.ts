import type { BREEDS } from '../../../src/entities/pet/Breeds.ts'

export type Breed = (typeof BREEDS)[number]
