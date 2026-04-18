<script setup>
import { GraduationCap } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <div class="mb-8">
      <h3 class="text-3xl font-light text-slate-100 flex items-center gap-3">
        <GraduationCap class="w-8 h-8 text-amber-400" />
        Education
      </h3>
      <p class="text-slate-400 mt-2">Learn video editing and encoding fundamentals.</p>
    </div>
    <div class="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-16 shadow-2xl flex flex-col items-center justify-center text-center gap-4">
      <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
        <GraduationCap class="w-8 h-8 text-amber-400" />
      </div>
      <h4 class="text-xl font-medium text-slate-200">Coming Soon</h4>
      <p class="text-slate-500 text-sm max-w-xs">The Education module is under development. Interactive guides on codecs, bitrates, and formats — coming in the next release.</p>
      <span class="mt-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">Planned for v1.2</span>
    </div>
  </div>
</template>
