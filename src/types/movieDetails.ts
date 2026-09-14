export default interface MovieDetails {
  backdrop_path: string
  genres: { id: number; name: string }[]
  id: number
  original_title: string
  overview: string
  release_date: string
  runtime: number
  vote_average: number
}
