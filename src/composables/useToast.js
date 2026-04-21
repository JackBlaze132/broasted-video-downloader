import { ref } from 'vue'

/**
 * Global shared toast list. Lives outside the function so all callers
 * share the same reactive list — no Pinia/Vuex needed.
 */
const toasts = ref([])

/**
 * Simple toast notification composable.
 * Usage: const { notify } = useToast()
 *        notify('Download complete!', 'success')
 */
export function useToast() {
  /**
   * @param {string} message
   * @param {'success'|'error'|'info'} type
   * @param {number} duration - ms before auto-dismiss
   */
  const notify = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)
  }

  const dismiss = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, notify, dismiss }
}
