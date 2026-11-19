<script setup lang="ts">
import { ref, watch } from 'vue'
import { Tag, Percent, Trash2, MessageSquare, Building2 } from 'lucide-vue-next'
import type { Game } from '../types/workshop'
import RatingBadge from './RatingBadge.vue'

const props = defineProps<{
  game: Game
  disabled?: boolean
}>()

const emit = defineEmits<{
  openDetails: [gameId: number]
  changeDiscount: [gameId: number, discount: number]
  deleteGame: [gameId: number]
}>()

const discountDraft = ref(props.game.discount)

watch(
  () => props.game.discount,
  (val) => {
    discountDraft.value = val
  }
)

const applyDiscount = () => {
  const clamped = Math.max(0, Math.min(90, Math.round(Number(discountDraft.value) || 0)))
  discountDraft.value = clamped
  emit('changeDiscount', props.game.id, clamped)
}
</script>

<template>
  <div class="card bg-base-100 shadow-lg border border-base-300 overflow-hidden flex flex-col">
    <figure class="relative h-48 bg-base-300 cursor-pointer" @click="emit('openDetails', game.id)">
      <img :src="game.image_url" :alt="game.title" class="w-full h-full object-cover" />
      <span class="badge badge-neutral absolute top-3 left-3 gap-1">
        <Tag class="w-3 h-3" />
        {{ game.genre }}
      </span>
      <span
        v-if="game.discount > 0"
        class="badge badge-success font-extrabold text-sm absolute top-3 right-3"
      >
        -{{ game.discount }}%
      </span>
    </figure>

    <div class="card-body p-5 flex-1 flex flex-col justify-between space-y-3">
      <div class="space-y-2">
        <div class="flex justify-between items-start gap-2">
          <h3
            class="card-title text-lg hover:text-primary cursor-pointer transition-colors"
            @click="emit('openDetails', game.id)"
          >
            {{ game.title }}
          </h3>
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square text-error shrink-0"
            title="Видалити гру"
            :disabled="disabled"
            @click="emit('deleteGame', game.id)"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="text-xs text-base-content/70 flex items-center gap-1.5">
          <Building2 class="w-3.5 h-3.5 text-primary" />
          <span>{{ game.developer }}</span>
        </div>

        <RatingBadge
          :status="game.rating_status"
          :total-reviews="game.total_reviews"
          :positive-percentage="game.positive_percentage"
        />
      </div>

      <div class="space-y-3 pt-2 border-t border-base-200">
        <div class="flex items-center justify-between">
          <div class="flex items-baseline gap-2">
            <template v-if="game.discount > 0">
              <span class="line-through text-sm opacity-50">{{ game.price }} ₴</span>
              <span class="text-xl font-extrabold text-accent">{{ game.final_price }} ₴</span>
              <span class="badge badge-accent badge-sm font-bold">-{{ game.discount }}%</span>
            </template>
            <template v-else>
              <span class="text-xl font-extrabold">{{ game.price }} ₴</span>
            </template>
          </div>

          <button
            type="button"
            class="btn btn-primary btn-sm gap-1"
            @click="emit('openDetails', game.id)"
          >
            <MessageSquare class="w-3.5 h-3.5" />
            Огляди
          </button>
        </div>

        <div class="join w-full">
          <span class="join-item btn btn-xs no-animation gap-1">
            <Percent class="w-3 h-3" />
            Знижка
          </span>
          <input
            v-model.number="discountDraft"
            type="number"
            min="0"
            max="90"
            class="input input-bordered input-xs join-item w-full"
          />
          <button
            type="button"
            class="btn btn-secondary btn-xs join-item"
            :disabled="disabled || discountDraft === game.discount"
            @click="applyDiscount"
          >
            Оновити
          </button>
        </div>
      </div>
    </div>
  </div>
</template>