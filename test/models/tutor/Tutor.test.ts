import { assert, assertEquals } from '@std/assert'
import { describe, it } from 'node:test'
import Tutor from '../../../src/models/tutor/Tutor.ts'
import type { State } from '../../../types/entities/tutor/State.d.ts'

describe('Tutor test', () => {
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
    const debt = 120

    // when
    const tutor = new Tutor({
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
      debt,
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
    assertEquals(tutor.debt, 120)
  })
})
