<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Gamepad2, Plus, Filter } from 'lucide-vue-next'
import { useWorkshopStore } from './stores/workshop.store'
import GameCard from './components/GameCard.vue'
import CreateGameModal from './components/CreateGameModal.vue'
import GameDetailsView from './components/GameDetailsView.vue'
import ToastContainer from './components/ToastContainer.vue'
import type { CreateGamePayload, CreateReviewPayload } from './types/workshop'

const store = useWorkshopStore()
const {
  games,
  genres,
  selectedGenre,
  selectedGame,
  activeReviews,
  isLoadingGames,
  isLoadingDetails,
  isSubmitting
} = storeToRefs(store)

const isCreateModalOpen = ref(false)

onMounted(() => {
  store.loadGames()
})

const handleCreateGame = async (payload: CreateGamePayload) => {
  const ok = await store.addNewGame(payload)
  if (ok) {
    isCreateModalOpen.value = false
  }
}

const handleAddReview = async (gameId: number, payload: CreateReviewPayload) => {
  await store.submitReview(gameId, payload)
}
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content pb-12">
    <ToastContainer />

    <header class="navbar bg-base-100 shadow-md px-4 md:px-8 mb-6 sticky top-0 z-30">
      <div class="flex-1">
        <button
          type="button"
          class="btn btn-ghost text-xl font-extrabold gap-2 text-primary"
          @click="store.closeGameDetails()"
        >
          <Gamepad2 class="w-6 h-6" />
          <span>Gabe’s Workshop</span>
        </button>
      </div>
      <div class="flex-none">
        <button
          type="button"
          class="btn btn-primary btn-sm gap-1.5"
          @click="isCreateModalOpen = true"
        >
          <Plus class="w-4 h-4" />
          Додати гру
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4">
      <div v-if="isLoadingDetails" class="flex justify-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <GameDetailsView
        v-else-if="selectedGame"
        :game="selectedGame"
        :reviews="activeReviews"
        :submitting="isSubmitting"
        @back="store.closeGameDetails()"
        @add-review="handleAddReview"
        @delete-review="store.removeReview"
      />

      <section v-else class="space-y-6">
        <div class="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-semibold flex items-center gap-1.5 mr-1">
              <Filter class="w-4 h-4 text-primary" />
              Жанр:
            </span>
            <button
              v-for="g in genres"
              :key="g"
              type="button"
              class="btn btn-xs sm:btn-sm"
              :class="selectedGenre === g ? 'btn-primary' : 'btn-ghost'"
              @click="store.selectGenreFilter(g)"
            >
              {{ g === 'All' ? 'Усі жанри' : g }}
            </button>
          </div>

          <button
            type="button"
            class="btn btn-outline btn-primary btn-sm gap-1.5"
            @click="isCreateModalOpen = true"
          >
            <Plus class="w-4 h-4" />
            Нова гра у каталог
          </button>
        </div>

        <div v-if="isLoadingGames" class="flex justify-center py-20">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <div v-else-if="games.length === 0" class="alert alert-info">
          <span>У вибраній категорії поки немає ігор. Додайте першу гру!</span>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameCard
            v-for="game in games"
            :key="game.id"
            :game="game"
            :disabled="isSubmitting"
            @open-details="store.openGameDetails"
            @change-discount="store.setGameDiscount"
            @delete-game="store.removeGame"
          />
        </div>
      </section>
    </main>

    <CreateGameModal
      :open="isCreateModalOpen"
      :submitting="isSubmitting"
      @close="isCreateModalOpen = false"
      @submit="handleCreateGame"
    />
  </div>
</template>