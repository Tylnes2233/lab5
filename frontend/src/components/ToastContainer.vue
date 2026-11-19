<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'
import { useToastStore } from '../stores/toast.store'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
</script>

<template>
  <div class="toast toast-top toast-end z-50 max-w-sm">
    <div
      v-for="item in toasts"
      :key="item.id"
      class="alert shadow-lg flex items-center justify-between gap-2 text-sm"
      :class="{
        'alert-success': item.type === 'success',
        'alert-error': item.type === 'error',
        'alert-info': item.type === 'info'
      }"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 v-if="item.type === 'success'" class="w-4 h-4 shrink-0" />
        <AlertCircle v-else-if="item.type === 'error'" class="w-4 h-4 shrink-0" />
        <Info v-else class="w-4 h-4 shrink-0" />
        <span>{{ item.text }}</span>
      </div>
      <button
        type="button"
        class="btn btn-ghost btn-xs btn-circle"
        @click="toastStore.dismissToast(item.id)"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>