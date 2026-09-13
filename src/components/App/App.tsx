import { useState } from "react"
import styles from "./App.module.css"
import SearchBar from "../SearchBar/SearchBar"
import { fetchMovieDetails, fetchMovies } from "../../services/movieService"
import {
  type MovieDetails,
  type AppState,
  type Movie,
  type ModalState,
} from "../../types/movie"
import MovieGrid from "../MovieGrid/MovieGrid"
import Loader from "../Loader/Loader"
import Hero from "../Hero/Hero"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import toast from "react-hot-toast"
import EmptyState from "../EmptyState/EmptyState"
import ErrorState from "../ErrorState/ErrorState"
import MovieModal from "../MovieModal/MovieModal"

function App() {
  const [appState, setAppState] = useState<AppState>("idle")

  const [movies, setMovies] = useState<Movie[]>([])

  const [query, setQuery] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const [modalState, setModalState] = useState<ModalState | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null)

  const handleSubmit = async (query: string): Promise<void> => {
    setQuery(query)

    try {
      setAppState("loading")
      const response = await fetchMovies(query)

      if (response.results.length === 0) {
        setMovies([])
        toast.error("No movies found for your request.")
        setAppState("empty")
      } else {
        setMovies(response.results)
        console.log(movies)

        setAppState("results")
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error"
      setErrorMsg(
        msg === "TMDB_KEY_MISSING" ? "API key not configured." : undefined,
      )
      setAppState("error")
    }
  }

  const handleRetry = () => {
    handleSubmit(query)
  }

  const onSelect = async (movieId: number): Promise<void> => {
    setModalState("loading")
    setSelectedMovie(null)

    try {
      const movie = await fetchMovieDetails(movieId)
      setSelectedMovie(movie)
      setModalState("ready")
    } catch (error) {
      console.error(error)
      setModalState("error")
    }
  }

  const handleCloseModal = (): void => {
    setSelectedMovie(null)
    setModalState(null)
  }

  return (
    <>
      <ErrorMessage />

      <SearchBar onSubmit={handleSubmit} isLoading={appState === "loading"} />
      <main>
        {appState === "idle" && <Hero />}
        {appState === "loading" && <Loader />}

        {appState === "empty" && <EmptyState query={query} />}
        {appState === "error" && (
          <ErrorState message={errorMsg} onRetry={handleRetry} />
        )}

        {appState === "results" && (
          <section className={styles.content}>
            <h2 className={styles.resultsHeading}>Results for "{query}"</h2>
            <MovieGrid movies={movies} onSelect={onSelect} />
          </section>
        )}
      </main>

      {modalState && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
          modalState={modalState}
        />
      )}
    </>
  )
}

export default App
