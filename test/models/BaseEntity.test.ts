import { test, mock } from 'node:test'
import BaseEntity from '../../src/models/BaseEntity.ts'
import { assertEquals } from '@std/assert/equals'

test('entity should default to null id and current timestamp for updatedAt and createdAt', () => {
  // given
  const fixedDateTime = Temporal.PlainDateTime.from('2026-12-31 23:59:59')
  const mockDateTime = mock.method(
    Temporal.Now,
    'plainDateTimeISO',
    () => fixedDateTime,
  )

  class User extends BaseEntity {
    name: string
    email: string

    constructor(
      name: string,
      email: string,
      id?: bigint,
      createdAt?: Temporal.PlainDateTime,
      updatedAt?: Temporal.PlainDateTime,
    ) {
      super(id, createdAt, updatedAt)
      this.name = name
      this.email = email
    }
  }

  // when
  const user = new User('zé', 'ze_das_couves@gmail.com')

  // then
  assertEquals(user.id, undefined)
  assertEquals(user.name, 'zé')
  assertEquals(user.email, 'ze_das_couves@gmail.com')
  assertEquals(user.createdAt, fixedDateTime)
  assertEquals(user.updatedAt, fixedDateTime)

  assertEquals(mockDateTime.mock.callCount(), 1)
  mock.reset()
})
