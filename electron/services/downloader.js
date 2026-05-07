import ytDlp from 'yt-dlp-exec'
import { binPaths } from '../config.js'
import { getDb } from './db.js'
import path from 'path'
import { app, BrowserWindow, dialog } from 'electron'
import { existsSync, mkdirSync } from 'fs'

/**
 * Maps quality preset IDs to their yt-dlp argument objects.
 * Adding a new preset only requires a new entry here — no if/else chains.
 */
const QUALITY_PRESETS = {
  mp3:   { extractAudio: true, audioFormat: 'mp3' },
  flac:  { extractAudio: true, audioFormat: 'flac' },
  '4k':  { 
    format: 'bestvideo[height<=2160][vcodec^=hev]+bestaudio[ext=m4a]/bestvideo[height<=2160]+bestaudio/best',
    mergeOutputFormat: 'mp4'
  },
  '1080p': { 
    format: 'bestvideo[height<=1080][vcodec^=avc]+bestaudio[ext=m4a]/bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best',
    mergeOutputFormat: 'mp4'
  },
  '720p':  { 
    format: 'bestvideo[height<=720][vcodec^=avc]+bestaudio[ext=m4a]/bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best',
    mergeOutputFormat: 'mp4'
  },
  best:  { 
    format: 'bestvideo[vcodec^=avc]+bestaudio[ext=m4a]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best',
    mergeOutputFormat: 'mp4'
  },
}

export const setupDownloader = (ipcMain) => {
  ipcMain.handle('downloader:default-folder', () => {
    return path.join(app.getPath('downloads'), 'Broasted')
  })

  ipcMain.handle('downloader:select-folder', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      title: 'Select Download Folder',
      properties: ['openDirectory', 'createDirectory'],
    })
    if (canceled || filePaths.length === 0) return null
    return filePaths[0]
  })

  ipcMain.handle('download:start', async (event, { url, quality, expertArgs, saveFolder }) => {
    const downloadsPath = saveFolder || path.join(app.getPath('downloads'), 'Broasted')
    if (!existsSync(downloadsPath)) {
      mkdirSync(downloadsPath, { recursive: true })
    }

    // Start with shared headers applied to every request
    let args = {
      noCheckCertificates: true,
      noWarnings: true,
      ffmpegLocation: binPaths.ffmpeg,
      keepVideo: false,
      windowsFilenames: true,
      trimFilenames: 150,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ],
      paths: downloadsPath,
    }

    // Apply quality preset — falls back to 'best' if unknown preset is given
    const preset = QUALITY_PRESETS[quality] ?? QUALITY_PRESETS.best
    args = { ...args, ...preset }

    // Expert mode: parse space-separated CLI flags and merge over preset args
    if (expertArgs && expertArgs.trim() !== '') {
      const parts = expertArgs.trim().split(/\s+/)
      let currentKey = null
      for (const part of parts) {
        if (part.startsWith('-')) {
          currentKey = part.replace(/^-+/, '')
          args[currentKey] = true
        } else if (currentKey) {
          args[currentKey] = part.replace(/^['"](.*)['"]$/, '$1')
          currentKey = null
        }
      }
    }

    return new Promise((resolve, reject) => {
      const customYtDlp = ytDlp.create(binPaths.ytdlp)
      const ytDlpProcess = customYtDlp.exec(url, args)

      ytDlpProcess.stdout.on('data', (data) => {
        const output = data.toString()
        console.log(`[yt-dlp] ${output}`)
        const match = output.match(/\[download\]\s+([\d.]+)%/)
        if (match) {
          event.sender.send('download:progress', parseFloat(match[1]))
        }
      })

      let lastStderr = ''
      ytDlpProcess.stderr.on('data', (data) => {
        const error = data.toString()
        lastStderr += error
        console.error(`[yt-dlp stderr] ${error}`)
      })

      ytDlpProcess.on('close', (code) => {
        if (code === 0) {
          // Write history entry after a successful download
          try {
            getDb()?.addHistory({ url, title: url, type: quality, status: 'completed' })
          } catch (e) {
            console.error('[db] Failed to write history:', e.message)
          }
          resolve({ success: true, message: 'Download finished' })
        } else {
          reject(new Error(`yt-dlp exited with code ${code}: ${lastStderr || 'Unknown error'}`))
        }
      })
    })
  })
}
