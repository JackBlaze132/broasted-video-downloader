<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { FileArchive, Wand2, ArrowRight } from 'lucide-vue-next'
import { useSaveFolder } from '../composables/useSaveFolder.js'
import { useToast } from '../composables/useToast.js'

const { saveFolder, chooseFolder, handleManualFolderUpdate } = useSaveFolder('compressor.saveFolder')
const { notify } = useToast()

const selectedProfile = ref('mobile')
const customLevel = ref(28)
const isCompressing = ref(false)
const progress = ref(0)
const expertMode = ref(false)
const selectedFile = ref(null)
const isDragging = ref(false)

const profiles = [
  { id: 'high',   name: 'High Quality',      desc: 'Minimal compression, best quality' },
  { id: 'mobile', name: 'Mobile Optimized',   desc: 'Perfect balance for social media' },
  { id: 'ultra',  name: 'Ultra Compressed',   desc: 'Maximum size reduction' },
]

let removeListener = null

onMounted(() => {
  if (window.electronAPI) {
    removeListener = window.electronAPI.onCompressProgress((val) => {
      progress.value = val
    })
  }
})

onUnmounted(() => {
  if (removeListener) removeListener()
})

const selectFile = async () => {
  if (!window.electronAPI) return
  const filePath = await window.electronAPI.selectFile()
  if (filePath) selectedFile.value = filePath
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && file.path) selectedFile.value = file.path
}

const startCompression = async () => {
  if (!selectedFile.value || !saveFolder.value || !window.electronAPI) return

  const fileName = selectedFile.value.split(/[/\\]/).pop()
  const dotIndex = fileName.lastIndexOf('.')
  const baseName = dotIndex !== -1 ? fileName.slice(0, dotIndex) : fileName
  const extName  = dotIndex !== -1 ? fileName.slice(dotIndex) : '.mp4'
  const sep = saveFolder.value.includes('\\') ? '\\' : '/'
  const outputPath = `${saveFolder.value.replace(/[/\\]$/, '')}${sep}${baseName}_compressed${extName}`

  isCompressing.value = true
  progress.value = 0

  try {
    await window.electronAPI.compressMedia({
      inputPath: selectedFile.value,
      outputPath,
      profile: selectedProfile.value,
      customLevel: customLevel.value,
      isExpertMode: expertMode.value,
    })
    progress.value = 100
    notify('Compression complete! File saved to: ' + outputPath, 'success')
  } catch (err) {
    console.error(err)
    notify('Compression failed: ' + err.message, 'error')
  } finally {
    isCompressing.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h3 class="text-3xl font-light text-slate-100 flex items-center gap-3">
          <FileArchive class="w-8 h-8 text-pink-400" />
          Compressor
        </h3>
        <p class="text-slate-400 mt-2">Shrink large files smartly using FFmpeg.</p>
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

    <div class="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-8 shadow-2xl space-y-8">

      <!-- Profile Selection -->
      <div>
        <label class="block text-sm font-medium text-slate-400 mb-4">Compression Profile</label>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="profile in profiles" :key="profile.id"
            @click="selectedProfile = profile.id"
            class="border rounded-xl p-4 cursor-pointer transition-all duration-300"
            :class="selectedProfile === profile.id
              ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/10'
              : 'border-slate-700 hover:border-slate-500 bg-slate-950/50'"
          >
            <div class="font-medium text-slate-200">{{ profile.name }}</div>
            <div class="text-xs text-slate-500 mt-1">{{ profile.desc }}</div>
          </div>
        </div>
      </div>

      <!-- Expert CRF Slider -->
      <div v-show="expertMode" class="bg-slate-950/50 p-6 rounded-xl border border-slate-800/50">
        <div class="flex justify-between mb-2 text-sm font-medium">
          <span class="text-slate-400">CRF Level (Video Bitrate)</span>
          <span class="text-pink-400 font-mono">{{ customLevel }}</span>
        </div>
        <input
          type="range"
          v-model="customLevel"
          min="0" max="51"
          class="w-full appearance-none bg-slate-800 h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-pink-400 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
        >
        <div class="flex justify-between text-xs text-slate-500 mt-2">
          <span>Lossless (0)</span>
          <span>Balanced (23)</span>
          <span>Lowest Quality (51)</span>
        </div>
      </div>

      <!-- Drop Zone + Compress Button -->
      <div class="flex gap-6 items-center border-t border-slate-800 pt-8">
        <div
          @click="selectFile"
          @dragenter.prevent="isDragging = true"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          class="flex-1 w-full bg-slate-950 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors group"
          :class="isDragging ? 'border-pink-500 bg-pink-500/10' : 'border-slate-700 hover:border-pink-500 hover:bg-pink-500/5'"
        >
          <span class="text-slate-400 group-hover:text-pink-400 transition-colors truncate block font-mono text-sm">
            {{ selectedFile ? selectedFile : 'Drag & Drop file or click to browse...' }}
          </span>
        </div>
        <ArrowRight class="w-6 h-6 text-slate-600 hidden lg:block" />
        <button
          @click="startCompression"
          :disabled="isCompressing || !selectedFile"
          class="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium py-6 px-12 rounded-xl transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
        >
          <Wand2 class="w-5 h-5" />
          {{ isCompressing ? 'Compressing...' : 'Start Job' }}
        </button>
      </div>

      <!-- Save Location -->
      <div class="border-t border-slate-800 pt-6">
        <label class="block text-sm font-medium text-slate-400 mb-2">Save Location</label>
        <div class="flex gap-4">
          <input
            v-model="saveFolder"
            @blur="handleManualFolderUpdate"
            type="text"
            placeholder="C:\Users\Downloads\Broasted..."
            class="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-sm"
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
      <div v-if="isCompressing || progress === 100" class="pt-2">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-slate-400">{{ progress === 100 ? 'Compression Complete!' : 'Processing...' }}</span>
          <span class="text-pink-400 font-mono font-medium">{{ Math.round(progress) }}%</span>
        </div>
        <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
