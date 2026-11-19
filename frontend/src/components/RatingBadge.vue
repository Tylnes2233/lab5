<script setup lang="ts">
import { computed } from 'vue'
import { ThumbsUp, ThumbsDown, MinusCircle, HelpCircle } from 'lucide-vue-next'
import type { RatingStatus } from '../types/workshop'

const props = defineProps<{
  status: RatingStatus
  totalReviews: number
  positivePercentage: number
}>()

const badgeClass = computed(() => {
  if (props.status === 'Overwhelmingly Positive') return 'badge-success'
  if (props.status === 'Positive') return 'badge-info'
  if (props.status === 'Mixed') return 'badge-warning'
  if (props.status === 'Negative') return 'badge-error'
  return 'badge-ghost'
})
</script>

<template>
  <div class="badge gap-1.5 font-semibold py-3 px-3" :class="badgeClass">
    <ThumbsUp
      v-if="status === 'Overwhelmingly Positive' || status === 'Positive'"
      class="w-3.5 h-3.5"
    />
    <MinusCircle v-else-if="status === 'Mixed'" class="w-3.5 h-3.5" />
    <ThumbsDown v-else-if="status === 'Negative'" class="w-3.5 h-3.5" />
    <HelpCircle v-else class="w-3.5 h-3.5" />

    <span>{{ status }}</span>
    <span v-if="totalReviews > 0" class="opacity-80 text-xs">
      ({{ positivePercentage }}% / {{ totalReviews }})
    </span>
  </div>
</template>