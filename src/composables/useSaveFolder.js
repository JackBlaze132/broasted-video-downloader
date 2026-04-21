import { ref, onMounted } from 'vue'

/**
 * Composable that manages a persistent save folder setting.
 * Each module uses a unique key so their settings are independent.
 *
 * @param {string} settingKey - DB key to store this module's folder preference
 * @returns {{ saveFolder, chooseFolder, handleManualFolderUpdate }}
 */
export function useSaveFolder(settingKey) {
  const saveFolder = ref('')

  onMounted(async () => {
    if (!window.electronAPI) return
    const result = await window.electronAPI.getSetting(settingKey)
    if (result?.success && result.value) {
      saveFolder.value = result.value
    } else {
      saveFolder.value = await window.electronAPI.getDefaultFolder()
    }
  })

  const chooseFolder = async () => {
    if (!window.electronAPI) return
    const folder = await window.electronAPI.selectFolder()
    if (folder) {
      saveFolder.value = folder
      await window.electronAPI.setSetting(settingKey, folder)
    }
  }

  const handleManualFolderUpdate = async () => {
    if (window.electronAPI && saveFolder.value) {
      await window.electronAPI.setSetting(settingKey, saveFolder.value)
    }
  }

  return { saveFolder, chooseFolder, handleManualFolderUpdate }
}
