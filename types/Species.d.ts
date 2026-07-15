import type { SPECIES } from "../src/models/pet/Species.ts"

export type Species = (typeof SPECIES)[number]
