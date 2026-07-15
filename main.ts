import os from 'node:os'
import MigrationRepository from './src/db/migrations/repository/MigrationRepository.ts'
import MigrationEntity from './src/db/migrations/model/MigrationEntity.ts'
import MigrationService from './src/db/migrations/service/MigrationService.ts'
import DatabaseService from './src/db/services/DatabaseService.ts'

const dbService = new DatabaseService(
  os.homedir(),
  '.local',
  '.share',
  'paw-system',
  'database.db',
)

const db = dbService.getInstance()
const migrationRepo = new MigrationRepository(db, MigrationEntity.tableName)
const migrationService = new MigrationService(
  migrationRepo,
  'src',
  'db',
  'migrations',
  'sql',
)

await migrationService.applyMigrations()

// @ts-expect-error - Deno.BrowserWindow is unstable feature
const win = new Deno.BrowserWindow({
  title: 'PawSystem',
})

win.addEventListener('close', () => {
  db.close()
  Deno.exit(0)
})

export function handler(req: Request): Response {
  const url = new URL(req.url)

  if (url.pathname === '/api') {
    return Response.json({
      message: 'Hello, world!',
      time: new Date().toISOString(),
    })
  }

  return new Response('<h1>Welcome to Deno!</h1>', {
    headers: { 'content-type': 'text/html' },
  })
}

if (import.meta.main) {
  Deno.serve(handler)
}
