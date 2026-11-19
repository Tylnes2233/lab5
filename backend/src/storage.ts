import fs from 'node:fs/promises'
import path from 'node:path'
import type { GameEntity, ReviewEntity } from './types.ts'

const DATA_DIR = path.join(process.cwd(), 'data')
const GAMES_FILE = path.join(DATA_DIR, 'games.json')
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json')

const initialGames: GameEntity[] = [
  {
    id: 1,
    title: 'Hollow Knight: Silksong',
    genre: 'Metroidvania',
    price: 599,
    discount: 20,
    developer: 'Team Cherry',
    image_url: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/header.jpg',
    description: 'Досліджуйте величезне королівство комах, опановуйте акробатичний бій та розкрийте таємниці стародавньої цитаделі.'
  },
  {
    id: 2,
    title: 'Hades II',
    genre: 'Roguelike',
    price: 699,
    discount: 0,
    developer: 'Supergiant Games',
    image_url: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145350/header.jpg',
    description: 'Боріться за межами Підземного світу, використовуючи темну магію проти Титана Часу у динамічному рогалику.'
  },
  {
    id: 3,
    title: 'Disco Elysium: The Final Cut',
    genre: 'RPG',
    price: 479,
    discount: 75,
    developer: 'ZA/UM',
    image_url: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/632470/header.jpg',
    description: 'Революційна рольова гра з відкритим світом, глибокими діалогами та повною свободою вибору ролі детектива.'
  },
  {
    id: 4,
    title: 'Factorio: Space Age',
    genre: 'Strategy',
    price: 750,
    discount: 10,
    developer: 'Wube Software',
    image_url: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/427520/header.jpg',
    description: 'Будуйте та автоматизуйте гігантські фабрики, запускайте ракети у космос і освоюйте нові планети.'
  }
]

const initialReviews: ReviewEntity[] = [
  {
    id: 101,
    game_id: 1,
    author: 'HornetFan_UA',
    is_recommended: true,
    hours_played: 64.5,
    text: 'Неймовірна атмосфера, бойова система стала ще швидшою та динамічнішою. Кожна локація — шедевр!',
    created_at: '2026-11-10T14:20:00.000Z'
  },
  {
    id: 102,
    game_id: 1,
    author: 'IndieExplorer',
    is_recommended: true,
    hours_played: 42,
    text: 'Саундтрек та арт-дирекшн на найвищому рівні. Боси змушують вивчати кожен рух.',
    created_at: '2026-11-12T18:05:00.000Z'
  },
  {
    id: 103,
    game_id: 3,
    author: 'RevacholDetective',
    is_recommended: true,
    hours_played: 38.2,
    text: 'Найкраще написані діалоги в історії індустрії. Внутрішні голоси персонажа — це геніально.',
    created_at: '2026-11-14T09:30:00.000Z'
  },
  {
    id: 104,
    game_id: 2,
    author: 'OlympusRunner',
    is_recommended: true,
    hours_played: 91,
    text: 'Безліч білдів, зброї та богів. Неможливо відірватися навіть після перемоги над фінальним босом.',
    created_at: '2026-11-15T21:15:00.000Z'
  },
  {
    id: 105,
    game_id: 4,
    author: 'BeltSpaghetti',
    is_recommended: false,
    hours_played: 120,
    text: 'Гра поглинула мій вільний час повністю, тепер конвеєри сняться вночі!',
    created_at: '2026-11-16T11:45:00.000Z'
  }
]

async function ensureStorageFiles(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })

  try {
    await fs.access(GAMES_FILE)
  } catch {
    await fs.writeFile(GAMES_FILE, JSON.stringify(initialGames, null, 2), 'utf-8')
  }

  try {
    await fs.access(REVIEWS_FILE)
  } catch {
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(initialReviews, null, 2), 'utf-8')
  }
}

export async function readGames(): Promise<GameEntity[]> {
  await ensureStorageFiles()
  const raw = await fs.readFile(GAMES_FILE, 'utf-8')
  return JSON.parse(raw) as GameEntity[]
}

export async function writeGames(games: GameEntity[]): Promise<void> {
  await ensureStorageFiles()
  await fs.writeFile(GAMES_FILE, JSON.stringify(games, null, 2), 'utf-8')
}

export async function readReviews(): Promise<ReviewEntity[]> {
  await ensureStorageFiles()
  const raw = await fs.readFile(REVIEWS_FILE, 'utf-8')
  return JSON.parse(raw) as ReviewEntity[]
}

export async function writeReviews(reviews: ReviewEntity[]): Promise<void> {
  await ensureStorageFiles()
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8')
}