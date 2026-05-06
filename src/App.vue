<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { DownloadCloud, FileArchive, Scissors, RefreshCw, GraduationCap, X, Heart, Github } from 'lucide-vue-next'
import ToastContainer from './components/ToastContainer.vue'

// Pull version dynamically from package.json — no hardcoding
import { version } from '../package.json'

const route = useRoute()
const showKofiBanner = ref(true)

const tabs = [
  { name: 'Downloader', path: '/downloader', icon: DownloadCloud },
  { name: 'Compressor', path: '/compressor', icon: FileArchive },
  { name: 'Editor',     path: '/editor',     icon: Scissors },
  { name: 'Converter',  path: '/converter',  icon: RefreshCw },
  { name: 'Education',  path: '/education',  icon: GraduationCap },
]
</script>

<template>
  <div class="flex h-screen bg-slate-950 text-slate-300">
    <!-- Toast notifications (rendered at document body level via Teleport) -->
    <ToastContainer />

    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
      <div class="px-6 py-8 flex items-center gap-3">
        <img src="./assets/logo/broasted_logo.svg" alt="Broasted Logo" class="w-10 h-10 object-contain" />
        <div>
          <h1 class="text-2xl text-slate-100 font-viga" style="font-family: 'Viga', sans-serif;">Broasted</h1>
          <p class="text-xs text-slate-500 mt-1">Version {{ version }}</p>
        </div>
      </div>

      <nav class="flex-1 px-4 space-y-2">
        <router-link
          v-for="tab in tabs" :key="tab.name"
          :to="tab.path"
          class="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3"
          :class="route.path.startsWith(tab.path)
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
            : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'"
        >
          <component :is="tab.icon" class="w-5 h-5" />
          {{ tab.name }}
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <div class="text-xs text-slate-500 flex items-center justify-center gap-1 flex-wrap">
          <span>Created with Love</span>
          <Heart class="w-3 h-3 text-red-500 fill-current" />
          <span>by</span>
          <a href="https://github.com/JackBlaze132" target="_blank" class="font-medium text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
            Blaze <Github class="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden bg-slate-950">
      <!-- Ko-fi Banner -->
      <div v-if="showKofiBanner" class="border-b border-slate-800 px-6 py-2 flex items-center justify-between z-20 w-full shrink-0" style="background: linear-gradient(to right, rgb(160, 155, 239), rgb(116, 235, 213)); -webkit-app-region: no-drag;">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-white drop-shadow-md">If you like my job, pls consider to </span>
          <a href='https://ko-fi.com/I2I612K2L0' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
        </div>
        <button @click="showKofiBanner = false" class="text-white hover:text-slate-200 transition-colors" title="Dismiss">
          <X class="w-5 h-5 drop-shadow-md" />
        </button>
      </div>

      <div class="flex-1 overflow-auto p-8 relative">
        <div class="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
        <div class="max-w-4xl mx-auto z-10 relative">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
