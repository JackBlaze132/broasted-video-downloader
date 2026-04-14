<script setup>
import { useRoute } from 'vue-router'
import { DownloadCloud, FileArchive, Scissors, RefreshCw, GraduationCap } from 'lucide-vue-next'
import ToastContainer from './components/ToastContainer.vue'

// Pull version dynamically from package.json — no hardcoding
import { version } from '../package.json'

const route = useRoute()

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
      <div class="px-6 py-8">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Broasted</h1>
        <p class="text-xs text-slate-500 mt-1">Version {{ version }}</p>
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
        <div class="text-xs text-slate-500 text-center">Electron &amp; Vue 3</div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden bg-slate-950">
      <header class="h-16 border-b border-slate-800 flex items-center justify-end px-8 bg-slate-900/50 backdrop-blur-sm z-10 w-full" style="-webkit-app-region: drag">
      </header>

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
