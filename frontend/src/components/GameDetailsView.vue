<script setup lang="ts">
import { reactive } from 'vue'
import {
  ArrowLeft,
  Building2,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Trash2,
  Send,
  Calendar
} from 'lucide-vue-next'
import type { CreateReviewPayload, Game, Review } from '../types/workshop'
import RatingBadge from './RatingBadge.vue'

const props = defineProps<{
  game: Game
  reviews: Review[]
  submitting?: boolean
}>()

const emit = defineEmits<{
  back: []
  addReview: [gameId: number, payload: CreateReviewPayload]
  deleteReview: [reviewId: number]
}>()

const reviewForm = reactive<CreateReviewPayload>({
  author: '',
  is_recommended: true,
  hours_played: 10,
  text: ''
})

const handlePublish = () => {
  if (!reviewForm.author.trim() || !reviewForm.text.trim()) return
  emit('addReview', props.game.id, {
    author: reviewForm.author.trim(),
    is_recommended: reviewForm.is_recommended,
    hours_played: Number(reviewForm.hours_played) || 0,
    text: reviewForm.text.trim()
  })
  reviewForm.text = ''
}

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="space-y-6">
    <button type="button" class="btn btn-ghost btn-sm gap-2" @click="emit('back')">
      <ArrowLeft class="w-4 h-4" />
      Назад до вітрини ігор
    </button>

    <div class="card lg:card-side bg-base-100 shadow-xl border border-base-300 overflow-hidden">
      <figure class="lg:w-96 shrink-0 bg-base-300">
        <img :src="game.image_url" :alt="game.title" class="w-full h-full object-cover min-h-64" />
      </figure>

      <div class="card-body justify-between space-y-4">
        <div class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="badge badge-neutral gap-1">
              <Tag class="w-3 h-3" />
              {{ game.genre }}
            </span>
            <span class="badge badge-outline gap-1">
              <Building2 class="w-3 h-3" />
              {{ game.developer }}
            </span>
            <RatingBadge
              :status="game.rating_status"
              :total-reviews="game.total_reviews"
              :positive-percentage="game.positive_percentage"
            />
          </div>

          <h1 class="text-2xl md:text-3xl font-extrabold">{{ game.title }}</h1>
          <p class="text-base-content/80 text-sm leading-relaxed">{{ game.description }}</p>
        </div>

        <div class="flex items-center gap-3 pt-3 border-t border-base-200">
          <template v-if="game.discount > 0">
            <span class="line-through text-base opacity-50">{{ game.price }} ₴</span>
            <span class="text-3xl font-extrabold text-accent">{{ game.final_price }} ₴</span>
            <span class="badge badge-accent font-bold">-{{ game.discount }}%</span>
          </template>
          <template v-else>
            <span class="text-3xl font-extrabold">{{ game.price }} ₴</span>
          </template>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-5 card bg-base-100 shadow-md border border-base-300">
        <div class="card-body space-y-4">
          <h2 class="card-title text-lg">Написати огляд на гру</h2>

          <form class="space-y-3" @submit.prevent="handlePublish">
            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-semibold">Ваш нікнейм *</span></label>
              <input
                v-model="reviewForm.author"
                type="text"
                class="input input-bordered input-sm w-full"
                placeholder="Наприклад: GordonFreeman"
                required
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-semibold">Награно годин</span></label>
              <input
                v-model.number="reviewForm.hours_played"
                type="number"
                min="0"
                step="0.5"
                class="input input-bordered input-sm w-full"
                required
              />
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-semibold">Чи рекомендуєте ви цю гру?</span></label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  class="btn btn-sm gap-1.5"
                  :class="reviewForm.is_recommended ? 'btn-success' : 'btn-outline'"
                  @click="reviewForm.is_recommended = true"
                >
                  <ThumbsUp class="w-4 h-4" />
                  Рекомендую
                </button>
                <button
                  type="button"
                  class="btn btn-sm gap-1.5"
                  :class="!reviewForm.is_recommended ? 'btn-error' : 'btn-outline'"
                  @click="reviewForm.is_recommended = false"
                >
                  <ThumbsDown class="w-4 h-4" />
                  Не рекомендую
                </button>
              </div>
            </div>

            <div class="form-control">
              <label class="label py-1"><span class="label-text text-xs font-semibold">Текст відгуку *</span></label>
              <textarea
                v-model="reviewForm.text"
                class="textarea textarea-bordered textarea-sm w-full"
                rows="4"
                placeholder="Поділіться враженнями від геймплею..."
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-sm w-full gap-2" :disabled="submitting">
              <Send class="w-4 h-4" />
              Опублікувати відгук
            </button>
          </form>
        </div>
      </div>

      <div class="lg:col-span-7 space-y-4">
        <h2 class="text-xl font-bold">Відгуки гравців ({{ reviews.length }})</h2>

        <div v-if="reviews.length === 0" class="alert">
          <span>На цю гру ще немає жодного відгуку. Станьте першим!</span>
        </div>

        <div
          v-for="rev in reviews"
          :key="rev.id"
          class="card bg-base-100 shadow-sm border border-base-300"
        >
          <div class="card-body p-4 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span
                  class="badge gap-1 font-semibold"
                  :class="rev.is_recommended ? 'badge-success' : 'badge-error'"
                >
                  <ThumbsUp v-if="rev.is_recommended" class="w-3 h-3" />
                  <ThumbsDown v-else class="w-3 h-3" />
                  {{ rev.is_recommended ? 'Рекомендує' : 'Не рекомендує' }}
                </span>
                <span class="font-bold text-sm">{{ rev.author }}</span>
              </div>

              <div class="flex items-center gap-3 text-xs opacity-70">
                <span class="flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5" />
                  {{ rev.hours_played }} год.
                </span>
                <span class="flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5" />
                  {{ formatDate(rev.created_at) }}
                </span>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-square text-error"
                  title="Видалити відгук"
                  :disabled="submitting"
                  @click="emit('deleteReview', rev.id)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p class="text-sm text-base-content/90 leading-relaxed">{{ rev.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>