import { extname, resolve } from '@std/path'
import MigrationEntity from '../model/MigrationEntity.ts'
import MigrationRepository from '../repository/MigrationRepository.ts'
import { assertEquals } from '@std/assert/equals'

export default class MigrationService {
  protected repository: MigrationRepository
  protected directoryPath: string

  constructor(repository: MigrationRepository, ...directoryPath: string[]) {
    this.repository = repository
    this.directoryPath = resolve(...directoryPath)
  }

  async applyMigrations() {
    const migrations = await this.getMigrations()
    const runMigrations = () => {
      this.repository.createMigrationsTable()
      for (const migration of migrations) {
        const existingMigration: MigrationEntity | null = this.repository
          .findMigrationByName(migration.name)
        if (existingMigration !== null) {
          assertEquals(migration.hash, existingMigration.hash)
          console.log(
            `Migration ${migration.name} already applied with id ${existingMigration.id} on ${existingMigration.createdAt}`,
          )
        } else {
          this.repository.execute(migration.content)
          this.repository.create({
            name: migration.name,
            content: migration.content,
            hash: migration.hash,
          })
        }
      }
    }
    this.repository.transaction(runMigrations)
  }

  private async getMigrations(): Promise<
    Array<{ name: string; content: string; hash: string }>
  > {
    const result = []
    const files = this.getSqlFiles()
    for (const { name } of files) {
      const filePath = resolve(this.directoryPath, name)
      const buffer = Deno.readFileSync(filePath)
      const content = this.getContent(buffer)
      const hash = await this.getHash(buffer)
      result.push({ name, content, hash })
    }
    return result
  }

  private getSqlFiles(): Array<Deno.DirEntry> {
    const files = [
      ...Deno.readDirSync(this.directoryPath).filter(
        (file) => extname(file.name) === '.sql',
      ),
    ]
    return files.sort((a, b) => a.name.localeCompare(b.name))
  }

  private getContent(buffer: Uint8Array<ArrayBuffer>): string {
    return new TextDecoder('utf-8').decode(buffer)
  }

  private async getHash(buffer: Uint8Array<ArrayBuffer>): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
}
