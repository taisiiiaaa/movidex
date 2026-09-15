import type { Movie } from "./movie"

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  original_title: string
  runtime: number
}
