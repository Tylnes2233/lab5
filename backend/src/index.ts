import express from 'express'
import cors from 'cors'
import { readGames, writeGames, readReviews, writeReviews } from './storage.ts'
import type { GameEntity, GameWithRating, RatingStatus, ReviewEntity } from './types.ts'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

function calculateRatingStatus(total: number, positivePercent: number): RatingStatus {
  if (total === 0) return 'No Reviews'
  if (positivePercent >= 90) return 'Overwhelmingly Positive'
  if (positivePercent >= 70) return 'Positive'
  if (positivePercent >= 40) return 'Mixed'
  return 'Negative'
}

function enrichGameWithRating(game: GameEntity, allReviews: ReviewEntity[]): GameWithRating {
  const gameReviews = allReviews.filter((r) => r.game_id === game.id)
  const totalReviews = gameReviews.length
  const positiveCount = gameReviews.filter((r) => r.is_recommended).length
  const positivePercentage =
    totalReviews === 0 ? 0 : Math.round((positiveCount / totalReviews) * 100)
  const ratingStatus = calculateRatingStatus(totalReviews, positivePercentage)
  const finalPrice = Math.round(game.price * (1 - game.discount / 100))

  return {
    ...game,
    final_price: finalPrice,
    total_reviews: totalReviews,
    positive_percentage: positivePercentage,
    rating_status: ratingStatus
  }
}

app.get('/api/games', async (req, res) => {
  const games = await readGames()
  const reviews = await readReviews()
  const genreQuery = typeof req.query.genre === 'string' ? req.query.genre.trim() : ''

  const filtered = genreQuery
    ? games.filter((g) => g.genre.toLowerCase() === genreQuery.toLowerCase())
    : games

  const enriched = filtered.map((game) => enrichGameWithRating(game, reviews))
  res.json(enriched)
})

app.get('/api/games/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Некоректний ID гри' })
    return
  }

  const games = await readGames()
  const game = games.find((g) => g.id === id)
  if (!game) {
    res.status(404).json({ message: 'Гру не знайдено' })
    return
  }

  const reviews = await readReviews()
  res.json(enrichGameWithRating(game, reviews))
})

app.post('/api/games', async (req, res) => {
  const { title, genre, price, discount, developer, image_url, description } = req.body

  if (typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ message: 'Поле title є обов’язковим' })
    return
  }
  if (typeof genre !== 'string' || !genre.trim()) {
    res.status(400).json({ message: 'Поле genre є обов’язковим' })
    return
  }
  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    res.status(400).json({ message: 'Ціна гри має бути числом більшим за 0' })
    return
  }

  const numericDiscount = discount === undefined ? 0 : Number(discount)
  if (Number.isNaN(numericDiscount) || numericDiscount < 0 || numericDiscount > 90) {
    res.status(400).json({ message: 'Знижка має бути в межах від 0 до 90%' })
    return
  }

  const games = await readGames()
  const nextId = games.length > 0 ? Math.max(...games.map((g) => g.id)) + 1 : 1

  const newGame: GameEntity = {
    id: nextId,
    title: title.trim(),
    genre: genre.trim(),
    price: numericPrice,
    discount: numericDiscount,
    developer:
      typeof developer === 'string' && developer.trim()
        ? developer.trim()
        : 'Indie Studio',
    image_url:
      typeof image_url === 'string' && image_url.trim()
        ? image_url.trim()
        : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description:
      typeof description === 'string' && description.trim()
        ? description.trim()
        : 'Опис гри від розробника.'
  }

  games.push(newGame)
  await writeGames(games)

  const reviews = await readReviews()
  res.status(201).json(enrichGameWithRating(newGame, reviews))
})

app.patch('/api/games/:id/discount', async (req, res) => {
  const id = Number(req.params.id)
  const discount = Number(req.body.discount)

  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Некоректний ID гри' })
    return
  }
  if (Number.isNaN(discount) || discount < 0 || discount > 90) {
    res.status(400).json({ message: 'Знижка повинна бути від 0 до 90%' })
    return
  }

  const games = await readGames()
  const game = games.find((g) => g.id === id)
  if (!game) {
    res.status(404).json({ message: 'Гру не знайдено' })
    return
  }

  game.discount = Math.round(discount)
  await writeGames(games)

  const reviews = await readReviews()
  res.json(enrichGameWithRating(game, reviews))
})

app.delete('/api/games/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Некоректний ID гри' })
    return
  }

  const games = await readGames()
  const exists = games.some((g) => g.id === id)
  if (!exists) {
    res.status(404).json({ message: 'Гру не знайдено' })
    return
  }

  const updatedGames = games.filter((g) => g.id !== id)
  await writeGames(updatedGames)

  const reviews = await readReviews()
  const updatedReviews = reviews.filter((r) => r.game_id !== id)
  await writeReviews(updatedReviews)

  res.status(204).send()
})

app.get('/api/games/:id/reviews', async (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Некоректний ID гри' })
    return
  }

  const games = await readGames()
  const exists = games.some((g) => g.id === id)
  if (!exists) {
    res.status(404).json({ message: 'Гру не знайдено' })
    return
  }

  const reviews = await readReviews()
  const filtered = reviews
    .filter((r) => r.game_id === id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  res.json(filtered)
})

app.post('/api/games/:id/reviews', async (req, res) => {
  const gameId = Number(req.params.id)
  if (Number.isNaN(gameId)) {
    res.status(400).json({ message: 'Некоректний ID гри' })
    return
  }

  const games = await readGames()
  const game = games.find((g) => g.id === gameId)
  if (!game) {
    res.status(404).json({ message: 'Гру не знайдено' })
    return
  }

  const { author, is_recommended, hours_played, text } = req.body

  if (typeof author !== 'string' || !author.trim()) {
    res.status(400).json({ message: 'Вкажіть ім’я автора відгуку' })
    return
  }
  if (typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ message: 'Текст відгуку не може бути порожнім' })
    return
  }

  const hours = Number(hours_played)
  if (Number.isNaN(hours) || hours < 0) {
    res.status(400).json({ message: 'Кількість награних годин має бути невід’ємним числом' })
    return
  }

  const reviews = await readReviews()
  const nextId = reviews.length > 0 ? Math.max(...reviews.map((r) => r.id)) + 1 : 1

  const newReview: ReviewEntity = {
    id: nextId,
    game_id: gameId,
    author: author.trim(),
    is_recommended: Boolean(is_recommended),
    hours_played: hours,
    text: text.trim(),
    created_at: new Date().toISOString()
  }

  reviews.push(newReview)
  await writeReviews(reviews)

  res.status(201).json(newReview)
})

app.delete('/api/reviews/:review_id', async (req, res) => {
  const reviewId = Number(req.params.review_id)
  if (Number.isNaN(reviewId)) {
    res.status(400).json({ message: 'Некоректний ID відгуку' })
    return
  }

  const reviews = await readReviews()
  const exists = reviews.some((r) => r.id === reviewId)
  if (!exists) {
    res.status(404).json({ message: 'Відгук не знайдено' })
    return
  }

  const updated = reviews.filter((r) => r.id !== reviewId)
  await writeReviews(updated)

  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Gabe's Workshop Backend running on http://localhost:${PORT}`)
})