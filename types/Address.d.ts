import type { State } from './State.d.ts'

export type Address = {
  street: string
  number?: string
  complement?: string
  neighborhood: string
  city: string
  state: State
  zipCode: string
}
