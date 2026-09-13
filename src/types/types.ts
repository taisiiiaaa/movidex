export interface Movie {
  id: number
  poster_path: string
  title: string
  release_date: string
  vote_average: number
}

export interface MovieDetails {
  backdrop_path: string
  genres: { id: number; name: string }[]
  id: number
  original_title: string
  overview: string
  release_date: string
  runtime: number
  vote_average: number
}

export type AppState = "idle" | "loading" | "results" | "empty" | "error"
export type ModalState = "loading" | "ready" | "error"
