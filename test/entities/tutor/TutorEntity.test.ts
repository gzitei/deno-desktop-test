import { assert, assertEquals, assertThrows } from '@std/assert'
import { describe, it } from 'node:test'
import type { State } from '../../../types/State.d.ts'
import type { TutorData } from '../../../types/TutorData.d.ts'
import type { Address } from '../../../types/Address.d.ts'
import InvalidFieldValueException from '../../../exceptions/InvalidFieldValueException.ts'
import TutorEntity from '../../../src/entities/tutors/TutorEntity.ts'

describe('TutorEntity test', () => {
  it('should instantiate Tutor with all fields', () => {
    // given
    const id = 100n
    const name = 'Raphael Veiga'
    const document = '123.456.789-10'
    const phone = '011912345678'
    const email = 'raphael.veiga@palmeiras.com.br'
    const street = 'Rua dos Bobos'
    const number = '0'
    const complement = 'Casa Muito Engraçada'
    const neighborhood = 'Bairro do Poeta'
    const city = 'Cidade dos Bobos'
    const state: State = 'São Paulo'
    const zipCode = '14680-000'
    const createdAt = Temporal.PlainDateTime.from('2026-01-01 16:25:59')
    const updatedAt = Temporal.PlainDateTime.from('2026-07-13 09:49:13')

    // when
    const tutor = new TutorEntity({
      id,
      name,
      document,
      phone,
      email,
      address: {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
      },
      createdAt,
      updatedAt,
    })

    assert(tutor)
    assertEquals(tutor.id, 100n)
    assertEquals(tutor.name, 'Raphael Veiga')
    assertEquals(tutor.document, '123.456.789-10')
    assertEquals(tutor.phone, '011912345678')
    assertEquals(tutor.email, 'raphael.veiga@palmeiras.com.br')
    assertEquals(
      tutor.createdAt,
      Temporal.PlainDateTime.from('2026-01-01 16:25:59'),
    )
    assertEquals(
      tutor.updatedAt,
      Temporal.PlainDateTime.from('2026-07-13 09:49:13'),
    )
    assert(tutor.address)
    assertEquals(tutor.address.street, 'Rua dos Bobos')
    assertEquals(tutor.address.number, '0')
    assertEquals(tutor.address.complement, 'Casa Muito Engraçada')
    assertEquals(tutor.address.neighborhood, 'Bairro do Poeta')
    assertEquals(tutor.address.city, 'Cidade dos Bobos')
    assertEquals(tutor.address.state, 'São Paulo')
    assertEquals(tutor.address.zipCode, '14680-000')
  })

  const invalidValues = [null, undefined, '', '  ']

  invalidValues.forEach((value) => {
    it('should throw when instantiate with invalid data', () => {
      const address: Address = {
        street: 'rua da casa',
        number: 'numero da casa',
        complement: 'complemento',
        neighborhood: 'bairro',
        city: 'cidade',
        state: 'Acre',
        zipCode: 'zip-code',
      }

      const data: TutorData = {
        id: 1n,
        name: 'pessoa da silva',
        document: 'documento',
        phone: 'telefone',
        email: 'email@example.com',
        address: address,
      }

      const requiredTutorFields = ['name', 'document', 'phone', 'email']

      for (const key of requiredTutorFields) {
        const body = { ...data, [key]: value }
        assertThrows(
          () => new TutorEntity(body),
          InvalidFieldValueException,
          `Invalid value provided for ${key}: '${value}'`,
        )
      }

      const requiredAddressFields = [
        'street',
        'neighborhood',
        'city',
        'state',
        'zipCode',
      ]
      for (const key of requiredAddressFields) {
        const body = { ...data, address: { ...address, [key]: value } }
        assertThrows(
          () => new TutorEntity(body),
          InvalidFieldValueException,
          `Invalid value provided for ${key}: '${value}'`,
        )
      }
    })
  })
})
