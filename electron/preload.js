const { contextBridge, ipcRenderer } = require('electron')

// Expose safe APIs to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  
  // Downloader APIs
  downloadStart: (options) => ipcRenderer.invoke('download:start', options),
  getDefaultFolder: () => ipcRenderer.invoke('downloader:default-folder'),
  selectFolder: () => ipcRenderer.invoke('downloader:select-folder'),
  onDownloadProgress: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('download:progress', subscription);
    return () => ipcRenderer.removeListener('download:progress', subscription);
  },
  removeDownloadListeners: () => ipcRenderer.removeAllListeners('download:progress'),

  // Media APIs
  selectFile: () => ipcRenderer.invoke('media:select-file'),
  selectSaveFile: (defaultName) => ipcRenderer.invoke('media:select-save-file', defaultName),
  compressMedia: (options) => ipcRenderer.invoke('media:compress', options),
  onCompressProgress: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on('media:compress-progress', subscription);
    return () => ipcRenderer.removeListener('media:compress-progress', subscription);
  },

  // Database APIs
  getHistory: () => ipcRenderer.invoke('db:get-history'),
  addHistory: (item) => ipcRenderer.invoke('db:add-history', item),
  getSetting: (key) => ipcRenderer.invoke('db:get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('db:set-setting', { key, value })
})
