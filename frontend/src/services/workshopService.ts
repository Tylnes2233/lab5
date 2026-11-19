import { httpClient } from '../api/httpClient'
import type {
  CreateGamePayload,
  CreateReviewPayload,
  Game,
  Review
} from '../types/workshop'

export const workshopService = {
  async fetchGames(genre?: string): Promise<Game[]> {
    const response = await httpClient.get<Game[]>('/api/games', {
      params: genre && genre !== 'All' ? { genre } : undefined
    })
    return response.data
  },

  async fetchGameById(id: number): Promise<Game> {
    const response = await httpClient.get<Game>(`/api/games/${id}`)
    return response.data
  },

  async createGame(payload: CreateGamePayload): Promise<Game> {
    const response = await httpClient.post<Game>('/api/games', payload)
    return response.data
  },

  async updateDiscount(gameId: number, discount: number): Promise<Game> {
    const response = await httpClient.patch<Game>(`/api/games/${gameId}/discount`, {
      discount
    })
    return response.data
  },

  async deleteGame(gameId: number): Promise<void> {
    await httpClient.delete(`/api/games/${gameId}`)
  },

  async fetchReviews(gameId: number): Promise<Review[]> {
    const response = await httpClient.get<Review[]>(`/api/games/${gameId}/reviews`)
    return response.data
  },

  async createReview(gameId: number, payload: CreateReviewPayload): Promise<Review> {
    const response = await httpClient.post<Review>(`/api/games/${gameId}/reviews`, payload)
    return response.data
  },

  async deleteReview(reviewId: number): Promise<void> {
    await httpClient.delete(`/api/reviews/${reviewId}`)
  }
}