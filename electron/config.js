import { app } from 'electron'
import path from 'path'

/**
 * Resolves the path to a bundled binary for both dev and production environments.
 * In dev, binaries are in the project's `assets/bin/` folder.
 * In production, they are placed in `process.resourcesPath/assets/bin/` via extraResources.
 * @param {string} binName - Binary name without extension (e.g. 'yt-dlp')
 * @returns {string} Absolute path to the binary
 */
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const getBinPath = (binName) => {
  const binaryName = process.platform === 'win32' ? `${binName}.exe` : binName;
  if (binName === 'ffmpeg') {
    let ffmpegPath = ffmpegInstaller.path;
    if (app.isPackaged) {
      // ffmpegInstaller.path inside an ASAR returns the virtual path.
      // We must point yt-dlp to the real, unpacked binary on disk.
      ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked');
    }
    return ffmpegPath;
  }
  if (!app.isPackaged) {
    return path.join(app.getAppPath(), 'assets', 'bin', binaryName);
  }
  return path.join(process.resourcesPath, 'assets', 'bin', binaryName);
};

export const binPaths = {
  ytdlp: getBinPath('yt-dlp'),
  ffmpeg: getBinPath('ffmpeg'),
};
