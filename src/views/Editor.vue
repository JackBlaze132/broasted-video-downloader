<script setup>
import { Scissors } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <div class="mb-8">
      <h3 class="text-3xl font-light text-slate-100 flex items-center gap-3">
        <Scissors class="w-8 h-8 text-emerald-400" />
        Editor
      </h3>
      <p class="text-slate-400 mt-2">Trim, cut, and merge media files.</p>
    </div>
    <div class="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-16 shadow-2xl flex flex-col items-center justify-center text-center gap-4">
      <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
        <Scissors class="w-8 h-8 text-emerald-400" />
      </div>
      <h4 class="text-xl font-medium text-slate-200">Coming Soon</h4>
      <p class="text-slate-500 text-sm max-w-xs">The Editor module is under development. Trim, cut, and merge video clips — coming in the next release.</p>
      <span class="mt-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">Planned for v1.1</span>
    </div>
  </div>
</template>
