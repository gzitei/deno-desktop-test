import type { SPECIES } from '../src/entities/pet/Species.ts'

export type Species = (typeof SPECIES)[number]
