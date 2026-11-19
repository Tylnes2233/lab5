export type RatingStatus =
  | 'Overwhelmingly Positive'
  | 'Positive'
  | 'Mixed'
  | 'Negative'
  | 'No Reviews'

export interface Game {
  id: number
  title: string
  genre: string
  price: number
  discount: number
  developer: string
  image_url: string
  description: string
  final_price: number
  total_reviews: number
  positive_percentage: number
  rating_status: RatingStatus
}

export interface Review {
  id: number
  game_id: number
  author: string
  is_recommended: boolean
  hours_played: number
  text: string
  created_at: string
}

export interface CreateGamePayload {
  title: string
  genre: string
  price: number
  discount: number
  developer: string
  image_url: string
  description: string
}

export interface CreateReviewPayload {
  author: string
  is_recommended: boolean
  hours_played: number
  text: string
}

export interface ToastMessage {
  id: number
  text: string
  type: 'success' | 'error' | 'info'
}