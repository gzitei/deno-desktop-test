import { DatabaseSync } from "node:sqlite"
import type { SQLOutputValue } from "node:sqlite"
import { after, afterEach, before, beforeEach, describe, it, mock } from "node:test"
import BaseEntity from "../../src/models/BaseEntity.ts"
import BaseEntityRepository from "../../src/repositories/BaseEntityRepository.ts"
import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert"

class DummyUserEntity extends BaseEntity {
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

class DummyUserRepository extends BaseEntityRepository<DummyUserEntity> {
  mapRowToEntity(row: Record<string, SQLOutputValue>): DummyUserEntity {
    return new DummyUserEntity(
      row.name!.toString(),
      row.email!.toString(),
      BigInt(row.id!.toString()),
      Temporal.PlainDateTime.from(row.createdAt!.toString()),
      Temporal.PlainDateTime.from(row.updatedAt!.toString()),
    )
  }
}

class DummyOrderEntity extends BaseEntity {
  userId: bigint
  item: string
  quantity: number
  date: Temporal.PlainDate

  constructor(
    userId: bigint,
    item: string,
    quantity: number,
    date: Temporal.PlainDate,
    id: bigint,
    createdAt: Temporal.PlainDateTime,
    updatedAt: Temporal.PlainDateTime,
  ) {
    super(id, createdAt, updatedAt)
    this.userId = userId
    this.item = item
    this.quantity = quantity
    this.date = date
  }
}

class DummyOrderRepository extends BaseEntityRepository<DummyOrderEntity> {
  mapRowToEntity(row: Record<string, SQLOutputValue>): DummyOrderEntity {
    return new DummyOrderEntity(
      BigInt(row.userId!.toString()),
      row.item!.toString(),
      Number(row.quantity!),
      Temporal.PlainDate.from(row.date!.toString()),
      BigInt(row.id!.toString()),
      Temporal.PlainDateTime.from(row.createdAt!.toString()),
      Temporal.PlainDateTime.from(row.updatedAt!.toString()),
    )
  }
}

class DummyShipmentEntity extends BaseEntity {
  orderId: bigint
  price: number

  constructor(
    orderId: bigint,
    price: number,
    id: bigint,
    createdAt: Temporal.PlainDateTime,
    updatedAt: Temporal.PlainDateTime,
  ) {
    super(id, createdAt, updatedAt)
    this.orderId = orderId
    this.price = price
  }
}

class DummyShipmentRepository extends BaseEntityRepository<DummyShipmentEntity> {
  mapRowToEntity(row: Record<string, SQLOutputValue>): DummyShipmentEntity {
    return new DummyShipmentEntity(
      BigInt(row.orderId!.toString()),
      Number(row.price!),
      BigInt(row.id!.toString()),
      Temporal.PlainDateTime.from(row.createdAt!.toString()),
      Temporal.PlainDateTime.from(row.updatedAt!.toString()),
    )
  }
}

describe("BaseEntityRepository test suite", () => {
  let db: DatabaseSync
  const table = "dummy_users"

  const getRepo = () => new DummyUserRepository(db, table)

  before(() => {
    db = new DatabaseSync(":memory:")
    db.exec(`
      CREATE TABLE IF NOT EXISTS ${table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
  })

  after(() => db.close())

  beforeEach(() => db.exec(`BEGIN;`))
  afterEach(() => db.exec(`ROLLBACK;`))

  it("should be able to instantiate a concrete repository", () => {
    // when
    const repo = new DummyUserRepository(db, table)

    // then
    assert(repo)
  })

  it("should allow for entity creation", () => {
    // given
    const repo = getRepo()
    const name = "Paulo Nobre"
    const email = "paulo.nobre@palmeiras.com.br"
    const data = { name, email }

    // when
    const created = repo.create(data)

    // then
    assert(created)
    assertEquals(created.id, 1n)
    assertEquals(created.name, "Paulo Nobre")
    assertEquals(created.email, "paulo.nobre@palmeiras.com.br")
  })

  it("should be able to retrieve entity by id", () => {
    // given
    const repo = getRepo()
    repo.create({
      name: "Abel Ferreira",
      email: "abel.ferreira@palmeiras.com.br",
    })

    // when
    const found = repo.findById(1n)

    // then
    assert(found)
    assert(Object.isFrozen(found))
    assertEquals(found.name, "Abel Ferreira")
    assertEquals(found.email, "abel.ferreira@palmeiras.com.br")
  })

  it("should list all entities", () => {
    // given
    const repo = getRepo()
    repo.create({
      name: "Paulo Nobre",
      email: "paulo.nobre@palmeiras.com.br",
    })
    repo.create({
      name: "Abel Ferreira",
      email: "abel.ferreira@palmeiras.com.br",
    })

    // when
    const all = repo.listAll()

    // then
    assertEquals(all.length, 2)
    assertEquals(all[0].id, 1n)
    assertEquals(all[0].name, "Paulo Nobre")
    assertEquals(all[0].email, "paulo.nobre@palmeiras.com.br")
    assertEquals(all[1].id, 2n)
    assertEquals(all[1].name, "Abel Ferreira")
    assertEquals(all[1].email, "abel.ferreira@palmeiras.com.br")
    assert(all.every((obj) => Object.isFrozen(obj)))
  })

  it("should delete entity by id", () => {
    // given
    const repo = getRepo()
    repo.create({
      name: "Max Pardalzinho",
      email: "max.pardalzinho@palmeiras.com.br",
    })
    repo.create({
      name: "Abel Ferreira",
      email: "abel.ferreira@palmeiras.com.br",
    })
    const all = repo.listAll()

    // when
    const isDeleted = repo.delete(1n)
    const found = repo.findById(2n)

    // then
    assertEquals(all.length, 2)
    assertEquals(all[0].id, 1n)
    assertEquals(all[0].name, "Max Pardalzinho")
    assertEquals(all[0].email, "max.pardalzinho@palmeiras.com.br")
    assertEquals(all[1].id, 2n)
    assertEquals(all[1].name, "Abel Ferreira")
    assertEquals(all[1].email, "abel.ferreira@palmeiras.com.br")
    assert(isDeleted)
    assert(found)
    assertEquals(found.id, 2n)
    assertThrows(() => repo.findById(1n))
  })

  it("should return false when unable to delete entity", () => {
    // given
    const repo = getRepo()

    // when
    const isDeleted = repo.delete(999n)

    // then
    assertFalse(isDeleted)
  })

  it("should update entity by id passing data without id", () => {
    // given
    const fixedDateTime = Temporal.PlainDateTime.from("2026-07-13 09:53:48")
    const mockDateTime = mock.method(
      Temporal.Now,
      "plainDateTimeISO",
      () => fixedDateTime,
    )
    const repo = getRepo()
    repo.create({
      name: "Abel Ferreira",
      email: "abel.ferreira@palmeiras.com.br",
    })

    // when
    repo.update(1n, { email: "90_minutos_e_muito_tempo@palmeiras.com.br" })
    const found = repo.findById(1n)

    // then
    assert(found)
    assertEquals(found.id, 1n)
    assertEquals(found.name, "Abel Ferreira")
    assertEquals(found.email, "90_minutos_e_muito_tempo@palmeiras.com.br")
    assertEquals(mockDateTime.mock.callCount(), 1)
    assertEquals(found.updatedAt, fixedDateTime)

    mock.reset()
  })

  it("should update entity when passed data with same id", () => {
    // given
    const fixedDateTime = Temporal.PlainDateTime.from("2026-07-13 09:53:48")
    const mockDateTime = mock.method(
      Temporal.Now,
      "plainDateTimeISO",
      () => fixedDateTime,
    )
    const repo = getRepo()
    repo.create({
      name: "Abel Ferreira",
      email: "abel.ferreira@palmeiras.com.br",
    })

    // when
    repo.update(1n, {
      id: 1n,
      email: "melhor.treinador@palmeiras.com.br",
    })
    const found = repo.findById(1n)

    // then
    assert(found)
    assertEquals(found.id, 1n)
    assertEquals(found.name, "Abel Ferreira")
    assertEquals(found.email, "melhor.treinador@palmeiras.com.br")
    assertEquals(mockDateTime.mock.callCount(), 1)
    assertEquals(found.updatedAt, fixedDateTime)

    mock.reset()
  })

  it("should throw when trying to update non-existing entity", () => {
    //given
    const repo = getRepo()

    // when & then
    assertThrows(
      () => repo.update(999n, { name: "Seu Zé" }),
      Error,
      `Unable to update entity id 999 in table ${table}`,
    )
  })

  it("should not allow to update entity with data from other entity id", () => {
    // given
    const repo = getRepo()
    repo.create({
      name: "Abel Ferreira",
      email: "abel.ferreira@palmeiras.com.br",
    })

    // when & then
    assertThrows(
      () =>
        repo.update(1n, {
          id: 999n,
          email: "90_minutos_e_muito_tempo@palmeiras.com.br",
        }),
      Error,
      `Unable to update entity id 1 with data from entity id 999`,
    )
  })
})

describe("BaseEntityRepository should allow for transactions", () => {
  let db: DatabaseSync
  const usersTable = "dummy_users"
  const ordersTable = "dummy_orders"
  const shipmentsTable = "dummy_shipments"

  const getRepos = (): [
    DummyUserRepository,
    DummyOrderRepository,
    DummyShipmentRepository,
  ] => [
    new DummyUserRepository(db, usersTable),
    new DummyOrderRepository(db, ordersTable),
    new DummyShipmentRepository(db, shipmentsTable),
  ]

  before(() => {
    db = new DatabaseSync(":memory:")
    db.exec(`
      BEGIN;

      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS ${usersTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ${ordersTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER REFERENCES ${usersTable}(id) ON DELETE CASCADE,
        item TEXT NOT NULL,
        quantity INTEGER DEFAULT 0,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ${shipmentsTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER REFERENCES ${ordersTable}(id) ON DELETE CASCADE,
        price REAL DEFAULT 0.0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      COMMIT;
    `)
  })

  after(() => db.close())

  afterEach(() => {
    db.exec(`
      BEGIN;

      DELETE FROM ${usersTable};
      DELETE FROM sqlite_sequence WHERE name = '${usersTable}';
      DELETE FROM ${ordersTable};
      DELETE FROM sqlite_sequence WHERE name = '${ordersTable}';
      DELETE FROM ${shipmentsTable};
      DELETE FROM sqlite_sequence WHERE name = '${shipmentsTable}';

      COMMIT;
    `)
  })

  it(`should execute transactions`, () => {
    // given
    const [userRepo, orderRepo, shipmentRepo] = getRepos()

    const user = {
      name: "Paulo Nobre",
      email: "paulo@nobre.com.br",
    }

    const order = {
      item: "café",
      quantity: 10,
      date: Temporal.PlainDate.from("2026-07-12"),
    }

    const shipment = {
      price: 15.0,
    }

    const execute = () => {
      const createdUser = userRepo.create(user)
      const createdOrder = orderRepo.create({
        ...order,
        userId: createdUser.id,
      })
      shipmentRepo.create({
        ...shipment,
        orderId: createdOrder.id,
      })
    }

    // when
    userRepo.transaction(execute)
    const users = userRepo.listAll()
    const orders = orderRepo.listAll()
    const shipments = shipmentRepo.listAll()

    // then
    assertEquals(users.length, 1)
    const foundUser = users[0]
    assertEquals(foundUser.name, "Paulo Nobre")
    assertEquals(foundUser.email, "paulo@nobre.com.br")
    assertEquals(foundUser.id, 1n)

    assertEquals(orders.length, 1)
    const foundOrder = orders[0]
    assertEquals(foundOrder.id, 1n)
    assertEquals(foundOrder.userId, foundUser.id)
    assertEquals(foundOrder.item, "café")
    assertEquals(foundOrder.quantity, 10)
    assertEquals(foundOrder.date, Temporal.PlainDate.from("2026-07-12"))

    assertEquals(shipments.length, 1)
    const foundShipment = shipments[0]
    assertEquals(foundShipment.id, 1n)
    assertEquals(foundShipment.orderId, foundOrder.id)
    assertEquals(foundShipment.price, 15.0)
  })

  it("should rollback on error", () => {
    // given
    const [userRepo, orderRepo, shipmentRepo] = getRepos()

    const users = [
      {
        name: "Paulo Nobre",
        email: "paulo@nobre.com",
      },
      {
        name: "Abel Ferreira",
        email: "abel@ferreira.com",
      },
      {
        name: "Outro Paulo Nobre",
        email: "paulo@nobre.com",
      },
    ]

    const orders = [
      {
        item: "cerveja",
        quantity: 30,
      },
      {
        item: "cachaça",
        quantity: 10,
      },
      {
        item: "café",
        quantity: 15,
      },
    ]

    const shipments = [
      {
        price: 100.0,
      },
      {
        price: 30.0,
      },
      {
        price: 8.0,
      },
    ]

    const execute = () => {
      users.forEach((user, idx) => {
        const createdUser = userRepo.create(user)
        const createdOrder = orderRepo.create({
          ...orders[idx],
          userId: createdUser.id,
        })
        shipmentRepo.create({ ...shipments[idx], orderId: createdOrder.id })
      })
    }

    // when & then
    assertThrows(
      () => userRepo.transaction(execute),
      Error,
      "UNIQUE constraint failed: dummy_users.email",
    )
    const allUsers = userRepo.listAll()
    const allOrders = orderRepo.listAll()
    const allShipments = shipmentRepo.listAll()
    assertEquals(allUsers.length, 0)
    assertEquals(allOrders.length, 0)
    assertEquals(allShipments.length, 0)
  })
})
