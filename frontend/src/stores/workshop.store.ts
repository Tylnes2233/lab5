import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { workshopService } from '../services/workshopService'
import { useToastStore } from './toast.store'
import type {
  CreateGamePayload,
  CreateReviewPayload,
  Game,
  Review
} from '../types/workshop'

export const useWorkshopStore = defineStore('workshop', () => {
  const toastStore = useToastStore()

  const games = ref<Game[]>([])
  const allGenresList = ref<string[]>([])
  const selectedGenre = ref<string>('All')
  const selectedGame = ref<Game | null>(null)
  const activeReviews = ref<Review[]>([])

  const isLoadingGames = ref(false)
  const isLoadingDetails = ref(false)
  const isSubmitting = ref(false)

  const genres = computed(() => ['All', ...allGenresList.value])

  async function loadGames(genre?: string) {
    isLoadingGames.value = true
    try {
      const targetGenre = genre ?? selectedGenre.value
      const list = await workshopService.fetchGames(targetGenre)
      games.value = list

      if (!targetGenre || targetGenre === 'All') {
        const unique = new Set(list.map((g) => g.genre))
        allGenresList.value = Array.from(unique)
      }
    } finally {
      isLoadingGames.value = false
    }
  }

  async function selectGenreFilter(genre: string) {
    selectedGenre.value = genre
    await loadGames(genre)
  }

  async function openGameDetails(gameId: number) {
    isLoadingDetails.value = true
    try {
      const [gameData, reviewsData] = await Promise.all([
        workshopService.fetchGameById(gameId),
        workshopService.fetchReviews(gameId)
      ])
      selectedGame.value = gameData
      activeReviews.value = reviewsData
    } finally {
      isLoadingDetails.value = false
    }
  }

  function closeGameDetails() {
    selectedGame.value = null
    activeReviews.value = []
  }

  async function addNewGame(payload: CreateGamePayload): Promise<boolean> {
    isSubmitting.value = true
    try {
      const created = await workshopService.createGame(payload)
      if (!allGenresList.value.includes(created.genre)) {
        allGenresList.value.push(created.genre)
      }
      await loadGames()
      toastStore.pushToast(`Гру «${created.title}» додано до каталогу`, 'success')
      return true
    } catch {
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function setGameDiscount(gameId: number, discount: number) {
    isSubmitting.value = true
    try {
      const updated = await workshopService.updateDiscount(gameId, discount)
      games.value = games.value.map((g) => (g.id === gameId ? updated : g))
      if (selectedGame.value?.id === gameId) {
        selectedGame.value = updated
      }
      toastStore.pushToast(`Знижку оновлено до ${updated.discount}%`, 'success')
    } finally {
      isSubmitting.value = false
    }
  }

  async function removeGame(gameId: number) {
    isSubmitting.value = true
    try {
      await workshopService.deleteGame(gameId)
      games.value = games.value.filter((g) => g.id !== gameId)
      if (selectedGame.value?.id === gameId) {
        closeGameDetails()
      }
      toastStore.pushToast('Гру та пов’язані відгуки видалено', 'info')
    } finally {
      isSubmitting.value = false
    }
  }

  async function submitReview(gameId: number, payload: CreateReviewPayload): Promise<boolean> {
    isSubmitting.value = true
    try {
      await workshopService.createReview(gameId, payload)
      await openGameDetails(gameId)
      await loadGames()
      toastStore.pushToast('Ваш відгук опубліковано', 'success')
      return true
    } catch {
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function removeReview(reviewId: number) {
    if (!selectedGame.value) return
    const gameId = selectedGame.value.id
    isSubmitting.value = true
    try {
      await workshopService.deleteReview(reviewId)
      await openGameDetails(gameId)
      await loadGames()
      toastStore.pushToast('Відгук видалено', 'info')
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    games,
    genres,
    selectedGenre,
    selectedGame,
    activeReviews,
    isLoadingGames,
    isLoadingDetails,
    isSubmitting,
    loadGames,
    selectGenreFilter,
    openGameDetails,
    closeGameDetails,
    addNewGame,
    setGameDiscount,
    removeGame,
    submitReview,
    removeReview
  }
})