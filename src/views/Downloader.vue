<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { DownloadCloud, PlayCircle, Settings2, FolderDown, ChevronDown, Info } from 'lucide-vue-next'
import { useSaveFolder } from '../composables/useSaveFolder.js'
import { useToast } from '../composables/useToast.js'

const { saveFolder, chooseFolder, handleManualFolderUpdate } = useSaveFolder('downloader.saveFolder')
const { notify } = useToast()

const url = ref('')
const selectedQuality = ref('1080p')
const isDownloading = ref(false)
const progress = ref(0)
const expertMode = ref(false)
const expertArgs = ref('')

onMounted(() => {
  if (window.electronAPI) {
    window.electronAPI.onDownloadProgress((value) => {
      progress.value = value
      if (progress.value >= 100) isDownloading.value = false
    })
  }
})

onUnmounted(() => {
  if (window.electronAPI) window.electronAPI.removeDownloadListeners()
})

const startDownload = async () => {
  if (!url.value) return
  isDownloading.value = true
  progress.value = 0

  if (window.electronAPI) {
    try {
      await window.electronAPI.downloadStart({
        url: url.value,
        quality: selectedQuality.value,
        expertArgs: expertMode.value ? expertArgs.value : '',
        saveFolder: saveFolder.value,
      })
      progress.value = 100
      isDownloading.value = false
      notify('Download complete!', 'success')
    } catch (err) {
      console.error(err)
      isDownloading.value = false
      notify('Download failed: ' + err.message, 'error')
    }
  } else {
    // Dev fallback without Electron
    const interval = setInterval(() => {
      progress.value += 5
      if (progress.value >= 100) {
        clearInterval(interval)
        isDownloading.value = false
      }
    }, 200)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h3 class="text-3xl font-light text-slate-100 flex items-center gap-3">
          <DownloadCloud class="w-8 h-8 text-purple-400" />
          Downloader
        </h3>
        <p class="text-slate-400 mt-2">Fetch high-quality media with yt-dlp precision.</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-slate-400 font-medium">Expert Mode</span>
        <button
          @click="expertMode = !expertMode"
          class="w-12 h-6 rounded-full p-1 transition-colors relative"
          :class="expertMode ? 'bg-purple-600' : 'bg-slate-700'"
        >
          <div
            class="w-4 h-4 bg-white rounded-full transition-transform absolute top-1"
            :class="expertMode ? 'translate-x-6' : 'translate-x-0'"
          ></div>
        </button>
      </div>
    </div>

    <div class="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-8 shadow-2xl">
      <div class="space-y-6">
        <!-- URL Input -->
        <div>
          <label class="block text-sm font-medium text-slate-400 mb-2">Media URL</label>
          <div class="flex gap-4">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <PlayCircle class="w-5 h-5 text-slate-500" />
              </div>
              <input
                v-model="url"
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                class="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-slate-600"
              >
            </div>
            <button
              @click="startDownload"
              :disabled="isDownloading || !url"
              class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-4 px-8 rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FolderDown class="w-5 h-5" />
              {{ isDownloading ? 'Downloading...' : 'Fetch Media' }}
            </button>
          </div>
        </div>

        <!-- Settings Bar -->
        <div class="grid grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-xl border border-slate-800/50">
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-2">Quality Preset</label>
            <div class="relative">
              <select v-model="selectedQuality" class="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                <option value="best">Best Available</option>
                <option value="4k">4K Ultra HD</option>
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p HD</option>
                <option value="mp3">Audio Only (MP3)</option>
                <option value="flac">Audio Only (FLAC)</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown class="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </div>
          <div v-if="expertMode">
            <label class="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
              Custom arguments
              <Settings2 class="w-4 h-4 text-pink-400" />
              <div class="relative group flex items-center">
                <Info class="w-4 h-4 text-slate-500 cursor-help transition-colors group-hover:text-pink-400" />
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 bg-slate-800 text-slate-300 text-xs rounded-xl p-3 shadow-xl border border-slate-700 z-10">
                  Pass custom yt-dlp arguments as a space-separated string. Arguments override UI presets.
                  <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
                </div>
              </div>
            </label>
            <input
              v-model="expertArgs"
              type="text"
              placeholder="e.g. --embed-metadata --audio-quality 0"
              class="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-xs"
            >
          </div>
        </div>

        <!-- Save Location -->
        <div>
          <label class="block text-sm font-medium text-slate-400 mb-2">Save Location</label>
          <div class="flex gap-4">
            <input
              v-model="saveFolder"
              @blur="handleManualFolderUpdate"
              type="text"
              placeholder="C:\Users\Downloads\Broasted..."
              class="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            >
            <button
              @click="chooseFolder"
              class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
            >
              Browse
            </button>
          </div>
        </div>

        <!-- Progress -->
        <div v-if="isDownloading || progress === 100" class="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-slate-400">{{ progress === 100 ? 'Download Complete!' : 'Downloading chunks...' }}</span>
            <span class="text-purple-400 font-mono font-medium">{{ progress }}%</span>
          </div>
          <div class="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 relative"
              :style="{ width: `${progress}%` }"
            >
              <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
