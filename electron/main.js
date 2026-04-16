import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { setupDownloader } from './services/downloader.js'
import { setupMedia } from './services/media.js'
import { setupDb } from './services/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isDev = !app.isPackaged

let mainWindow
let dbInstance

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.setMenuBarVisibility(false)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

ipcMain.handle('ping', () => 'pong')

setupDownloader(ipcMain)
setupMedia(ipcMain)
dbInstance = setupDb(ipcMain)

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Graceful shutdown: close DB before the process exits
app.on('before-quit', () => {
  if (dbInstance) {
    try {
      dbInstance.close()
    } catch (e) {
      console.error('[main] Error closing DB:', e.message)
    }
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
