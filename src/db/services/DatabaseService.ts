import { DatabaseSync } from 'node:sqlite'
import * as path from '@std/path'

export default class DatabaseService {
  private db: DatabaseSync | null
  readonly filePath: string

  constructor(...filePath: string[]) {
    const [root, ...rest] = filePath
    this.filePath = path.join(root, ...rest)
    this.db = null
  }

  getInstance(): DatabaseSync {
    if (this.db == null) {
      this.prepareDirectory()
      this.db = new DatabaseSync(this.filePath)
    }
    return this.db
  }

  getPath(): string {
    return this.filePath
  }

  private prepareDirectory() {
    const dir = path.dirname(this.filePath)
    Deno.mkdirSync(dir, { recursive: true })
  }
}
