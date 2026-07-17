import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import type { Breed } from '../../../types/entities/pet/Breed.d.ts'
import type { PetEntityData } from '../../../types/entities/pet/PetEntityData.d.ts'
import type { Species } from '../../../types/entities/pet/Species.d.ts'
import BaseEntity from '../BaseEntity.ts'
import { BREEDS } from './Breeds.ts'
import { SPECIES } from './Species.ts'

export default class PetEntity extends BaseEntity {
  static override tableName: string = 'pets'
  tutorId: bigint
  name: string
  species: Species
  breed: Breed
  birthDate: Temporal.PlainDate
  active: boolean

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
    super(id, createdAt, updatedAt)
    this.validateFieldValue(tutorId, 'tutorId')
    this.tutorId = tutorId
    this.validateFieldValue(name, 'name')
    this.name = name
    this.validateFieldValue(species, 'species')
    this.species = species
    this.validateFieldValue(breed, 'breed')
    this.breed = breed
    this.validateFieldValue(birthDate, 'birthDate')
    this.birthDate = birthDate
    this.active = active ?? true
  }

  private validateFieldValue(value: unknown, fieldName: string) {
    if (value === null || value === undefined) {
      this.throwInvalidFieldValueException(value, fieldName)
    }
    if (fieldName === 'species' && !SPECIES.includes(value as Species)) {
      this.throwInvalidFieldValueException(value, fieldName)
    }
    if (fieldName === 'breed' && !BREEDS.includes(value as Breed)) {
      this.throwInvalidFieldValueException(value, fieldName)
    }
    if (fieldName === 'birthDate') {
      this.validateBirthDate(value as Temporal.PlainDate)
    }
  }

  private throwInvalidFieldValueException(value: unknown, fieldName: string) {
    throw new InvalidFieldValueException(
      `Invalid value provided for ${fieldName}: '${value}'`,
    )
  }

  private validateBirthDate(value: Temporal.PlainDate) {
    if (
      Temporal.PlainDate.compare(
        Temporal.Now.plainDateISO(),
        value as Temporal.PlainDate,
      ) === -1
    ) {
      throw new InvalidFieldValueException(
        'Field birthDate cannot be a future date.',
      )
    }
  }
}
