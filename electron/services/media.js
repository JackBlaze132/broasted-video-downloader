import ffmpeg from 'fluent-ffmpeg'
import { binPaths } from '../config.js'
import { dialog, app, BrowserWindow } from 'electron'
import path from 'path'
import fs from 'fs'

export const setupMedia = (ipcMain) => {
  ffmpeg.setFfmpegPath(binPaths.ffmpeg)

  ipcMain.handle('media:select-file', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      title: 'Select Media File',
      properties: ['openFile'],
      filters: [{ name: 'Media Files', extensions: ['mp4', 'mkv', 'avi', 'mov', 'mp3', 'wav', 'm4a'] }],
    })
    if (canceled || filePaths.length === 0) return null
    return filePaths[0]
  })

  ipcMain.handle('media:select-save-file', async (event, defaultName) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      title: 'Save Compressed File',
      defaultPath: path.join(app.getPath('downloads'), defaultName || 'output.mp4'),
      filters: [{ name: 'Videos', extensions: ['mp4', 'mkv'] }],
    })
    if (canceled) return null
    return filePath
  })

  ipcMain.handle('media:compress', async (event, { inputPath, outputPath, profile, customLevel, isExpertMode }) => {
    // Ensure the output directory exists before handing off to ffmpeg
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // CRF quality map (lower = better quality, larger file)
    const CRF_MAP = { high: 18, mobile: 28, ultra: 35 }
    const crf = isExpertMode ? customLevel : (CRF_MAP[profile] ?? 28)

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-c:v libx264',
          `-crf ${crf}`,
          '-preset fast',
          '-c:a aac',
          '-b:a 128k',
        ])
        .on('progress', (progress) => {
          if (progress.percent !== undefined) {
            event.sender.send('media:compress-progress', progress.percent)
          }
        })
        .on('end', () => resolve({ success: true, outputPath }))
        .on('error', (err) => reject(new Error(err.message)))
        .save(outputPath)
    })
  })
}
