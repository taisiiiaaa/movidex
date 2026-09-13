import axios from "axios"
import type { Movie, MovieDetails } from "../types/types"

export interface MovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

const BASE_URL = import.meta.env.VITE_TMDB_API_URL

const SEARCH_MOVIES_URL = `${BASE_URL}/search/movie`
const MOVIE_DETAILS_URL = `${BASE_URL}/movie`
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const fetchMovies = async (query: string): Promise<MovieResponse> => {
  const { data } = await axios.get<MovieResponse>(SEARCH_MOVIES_URL, {
    params: { query },
    headers: { Authorization: `Bearer ${API_KEY}` },
  })

  return data
}

export const fetchMovieDetails = async (id: number): Promise<MovieDetails> => {
  const { data } = await axios.get<MovieDetails>(`${MOVIE_DETAILS_URL}/${id}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  })

  return data
}
