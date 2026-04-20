import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'

/**
 * AppDatabase wraps better-sqlite3 and exposes typed methods for each operation.
 * This keeps SQL out of the IPC handlers and makes each method independently testable.
 */
class AppDatabase {
  constructor(dbPath) {
    this.db = new Database(dbPath)
    this._initSchema()
  }

  _initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        title TEXT,
        type TEXT,
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `)
  }

  getHistory() {
    return this.db.prepare('SELECT * FROM history ORDER BY timestamp DESC LIMIT 50').all()
  }

  addHistory(item) {
    this.db.prepare(
      'INSERT INTO history (url, title, type, status) VALUES (@url, @title, @type, @status)'
    ).run(item)
  }

  getSetting(key) {
    const result = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key)
    return result ? JSON.parse(result.value) : null
  }

  setSetting(key, value) {
    this.db.prepare(`
      INSERT INTO settings (key, value) VALUES (@key, @value)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run({ key, value: JSON.stringify(value) })
  }

  close() {
    this.db.close()
  }
}

// Singleton instance — created once in setupDb, then accessible via getDb()
let dbInstance = null

/**
 * Returns the shared AppDatabase instance. Call only after setupDb() has run.
 * @returns {AppDatabase|null}
 */
export const getDb = () => dbInstance

/**
 * Initializes the database and registers all db:* IPC handlers.
 * @param {Electron.IpcMain} ipcMain
 */
export const setupDb = (ipcMain) => {
  const dbPath = path.join(app.getPath('userData'), 'broasted.sqlite')
  dbInstance = new AppDatabase(dbPath)

  ipcMain.handle('db:get-history', () => {
    try {
      return { success: true, data: dbInstance.getHistory() }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('db:add-history', (_event, item) => {
    try {
      dbInstance.addHistory(item)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('db:get-setting', (_event, key) => {
    try {
      return { success: true, value: dbInstance.getSetting(key) }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('db:set-setting', (_event, { key, value }) => {
    try {
      dbInstance.setSetting(key, value)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  // Return the instance so main.js can close it gracefully on quit
  return dbInstance
}
