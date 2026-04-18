<script setup>
import { RefreshCw } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <div class="mb-8">
      <h3 class="text-3xl font-light text-slate-100 flex items-center gap-3">
        <RefreshCw class="w-8 h-8 text-sky-400" />
        Converter
      </h3>
      <p class="text-slate-400 mt-2">Convert between video and audio formats.</p>
    </div>
    <div class="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-16 shadow-2xl flex flex-col items-center justify-center text-center gap-4">
      <div class="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
        <RefreshCw class="w-8 h-8 text-sky-400" />
      </div>
      <h4 class="text-xl font-medium text-slate-200">Coming Soon</h4>
      <p class="text-slate-500 text-sm max-w-xs">The Converter module is under development. Quickly convert between MP4, MKV, MP3, and more — coming in the next release.</p>
      <span class="mt-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">Planned for v1.1</span>
    </div>
  </div>
</template>
