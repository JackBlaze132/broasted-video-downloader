<script setup>
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'
import { useToast } from '../composables/useToast.js'

const { toasts, dismiss } = useToast()

const icons = { success: CheckCircle, error: XCircle, info: Info }
const colors = {
  success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
  error:   'border-red-500/50 bg-red-500/10 text-red-300',
  info:    'border-purple-500/50 bg-purple-500/10 text-purple-300',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl pointer-events-auto cursor-pointer"
          :class="colors[toast.type]"
          @click="dismiss(toast.id)"
        >
          <component :is="icons[toast.type]" class="w-5 h-5 shrink-0 mt-0.5" />
          <span class="text-sm leading-snug flex-1">{{ toast.message }}</span>
          <X class="w-4 h-4 shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5" />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.25s ease-in; }
.toast-enter-from { opacity: 0; transform: translateY(12px) scale(0.95); }
.toast-leave-to  { opacity: 0; transform: translateX(20px) scale(0.95); }
</style>
