import { DatabaseSync } from 'node:sqlite'
import TutorEntityRepository from '../../src/repositories/tutor/TutorEntityRepository.ts'
import PetEntityRepository from '../../src/repositories/pet/PetEntityRepository.ts'
import MigrationRepository from '../../src/db/migrations/repository/MigrationRepository.ts'
import MigrationService from '../../src/db/migrations/service/MigrationService.ts'
import MedicalHistoryEntityRepository from '../../src/repositories/medical-history/MedicalHistoryEntityRepository.ts'
import TutorEntity from '../../src/entities/tutor/TutorEntity.ts'
import PetEntity from '../../src/entities/pet/PetEntity.ts'
import MedicalHistoryEntity from '../../src/entities/medica-history/MedicalHistoryEntity.ts'
import MedicalRecordEntityRepository from '../../src/repositories/medical-record/MedicalRecordEntityRepository.ts'
import MedicalRecordEntity from '../../src/entities/medical-record/MedicalRecordEntity.ts'

export function createDummyTutor(db: DatabaseSync): TutorEntity {
  const tutorRepo = new TutorEntityRepository(db, TutorEntity.tableName)
  return tutorRepo.create({
    name: 'Dummy Tutor',
    document: 'dummy-document',
    phone: 'dummy-phone',
    email: 'dummy@email.com',
    address: {
      street: 'dummy street',
      number: '42',
      complement: 'dummy-apartment',
      neighborhood: 'dummy-neighborhood',
      city: 'dummyland',
      state: 'Piauí',
      zipCode: 'dummy-zip-code',
    },
  })
}

export function createDummyPet(db: DatabaseSync): PetEntity {
  const tutor = createDummyTutor(db)
  const petRepo = new PetEntityRepository(db, PetEntity.tableName)
  return petRepo.create({
    tutorId: tutor.id,
    name: 'dummy-pet',
    species: 'Felina',
    breed: 'Bulldog Francês',
    birthDate: Temporal.PlainDate.from('2025-12-31'),
  })
}

export function createDummyMedicalHistory(db: DatabaseSync) {
  const pet = createDummyPet(db)
  const medicalHistoryRepo = new MedicalHistoryEntityRepository(
    db,
    MedicalHistoryEntity.tableName,
  )
  return medicalHistoryRepo.create({
    petId: pet.id,
  })
}

export function createDummyMedicalRecord(db: DatabaseSync) {
  const medicaHistory = createDummyMedicalHistory(db)
  const medicalRecordRepo = new MedicalRecordEntityRepository(db, MedicalRecordEntity.tableName)
  return medicalRecordRepo.create({
    medicalHistoryId: medicaHistory.id,
    date: Temporal.PlainDateTime.from('2026-07-10 16:47:13'),
    details: 'dummy medical record details',
  })
}

export async function runMigrations(db: DatabaseSync) {
  const migrationRepository = new MigrationRepository(db, 'migrations')
  const migrationService = new MigrationService(
    migrationRepository,
    'src',
    'db',
    'migrations',
    'sql',
  )
  await migrationService.applyMigrations()
}
