import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ToastMessage } from '../types/workshop'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])

  function pushToast(text: string, type: ToastMessage['type'] = 'info', timeout = 3500) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, text, type })
    setTimeout(() => {
      dismissToast(id)
    }, timeout)
  }

  function dismissToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    pushToast,
    dismissToast
  }
})