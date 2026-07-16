import type { SPECIES } from '../src/entities/pets/Species.ts'

export type Species = (typeof SPECIES)[number]
