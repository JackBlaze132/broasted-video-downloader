<div align="center">

# 🍗 Broasted

**A powerful, cross-platform desktop application for downloading, compressing, and processing media.**

[![Electron](https://img.shields.io/badge/Electron-41-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

- 🎬 **Downloader** — Download videos and audio from thousands of sites powered by `yt-dlp`, with quality selection and expert argument support
- 🗜️ **Compressor** — Compress video files to a target size or bitrate using `ffmpeg`
- 🎵 **Media Tools** — Additional media processing utilities (conversion, editing)
- 📚 **History** — Local SQLite-backed download history, persisted across sessions
- 📁 **Custom Save Folders** — Choose where files land, with a smart default at `Downloads/Broasted`
- 🔒 **Secure IPC** — Context-isolated renderer with a strict preload bridge — no `nodeIntegration`
- 🖥️ **Cross-Platform** — Ships as NSIS installer (Windows), DMG (macOS), and AppImage (Linux)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Shell | [Electron 41](https://www.electronjs.org/) |
| Frontend | [Vue 3](https://vuejs.org/) + [Vite 8](https://vitejs.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Icons | [Lucide Vue Next](https://lucide.dev/) |
| Media | [yt-dlp-exec](https://github.com/nicolo-ribaudo/yt-dlp-exec) + [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) |
| Database | [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Packaging | [electron-builder](https://www.electron.build/) |

---

## 📦 Releases

Pre-built installers are available on the [**GitHub Releases**](https://github.com/your-username/broasted/releases) page — no Node.js or build tools required.

| Platform | Installer | Format |
|---|---|---|
| 🪟 Windows | `Broasted-Setup-x.x.x.exe` | NSIS Installer |
| 🍎 macOS | `Broasted-x.x.x.dmg` | Disk Image |
| 🐧 Linux | `Broasted-x.x.x.AppImage` | AppImage (portable) |

> [!TIP]
> On **Linux**, make the AppImage executable before running it:
> ```bash
> chmod +x Broasted-*.AppImage && ./Broasted-*.AppImage
> ```

> [!NOTE]
> On **macOS**, you may need to allow the app under **System Settings → Privacy & Security** if you see a Gatekeeper warning (the app is currently unsigned).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+**
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/broasted.git
cd broasted

# Install dependencies
npm install
```

### Development

```bash
# Start the Vite dev server + Electron together
npm run dev:electron
```

This runs the Vue frontend on `http://localhost:5173` and launches Electron pointing to it, with DevTools open automatically.

### Production Build

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

Built installers are output to `dist-electron/`.

---

## 📁 Project Structure

```
broasted/
├── electron/
│   ├── main.js          # Main process — window creation & IPC wiring
│   ├── preload.js       # Secure context bridge (renderer ↔ main)
│   ├── config.js        # App-wide configuration constants
│   └── services/
│       ├── downloader.js # yt-dlp download logic
│       ├── media.js      # ffmpeg media processing
│       └── db.js         # SQLite history database
├── src/
│   ├── views/
│   │   ├── Downloader.vue  # Download UI
│   │   ├── Compressor.vue  # Compression UI
│   │   ├── Converter.vue   # Format converter
│   │   ├── Editor.vue      # Media editor
│   │   └── Education.vue   # Tips & info
│   ├── App.vue          # Root layout & sidebar navigation
│   └── main.js          # Vue app entry point
├── assets/              # Bundled binary assets (ffmpeg, yt-dlp)
├── public/              # Static public files
├── index.html           # HTML entry point
├── vite.config.js       # Vite + Electron build configuration
└── package.json
```

---

## ⚙️ Configuration

Key settings live in `electron/config.js`. The app stores user data (SQLite database) in the OS default `userData` path:

| OS | Path |
|---|---|
| Windows | `%APPDATA%\Broasted\broasted.sqlite` |
| macOS | `~/Library/Application Support/Broasted/broasted.sqlite` |
| Linux | `~/.config/Broasted/broasted.sqlite` |

Downloaded files default to `~/Downloads/Broasted/` and can be overridden per-session.

---

## 🔐 Security

- **`nodeIntegration: false`** — The renderer process has no direct Node.js access
- **`contextIsolation: true`** — A hardened preload script acts as the only bridge between the UI and the main process
- **No remote code execution** — All media processing runs locally via bundled binaries

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ using Electron, Vue 3, and open-source media tools</sub>
</div>
