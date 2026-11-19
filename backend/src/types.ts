export interface GameEntity {
  id: number
  title: string
  genre: string
  price: number
  discount: number
  developer: string
  image_url: string
  description: string
}

export interface ReviewEntity {
  id: number
  game_id: number
  author: string
  is_recommended: boolean
  hours_played: number
  text: string
  created_at: string
}

export type RatingStatus =
  | 'Overwhelmingly Positive'
  | 'Positive'
  | 'Mixed'
  | 'Negative'
  | 'No Reviews'

export interface GameWithRating extends GameEntity {
  final_price: number
  total_reviews: number
  positive_percentage: number
  rating_status: RatingStatus
}