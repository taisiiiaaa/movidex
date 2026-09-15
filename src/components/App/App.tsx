import { useState } from "react"
import styles from "./App.module.css"
import SearchBar from "../SearchBar/SearchBar"
import { fetchMovies } from "../../services/movieService"
import type { Movie } from "../../types/movie"
import MovieGrid from "../MovieGrid/MovieGrid"
import Loader from "../Loader/Loader"
import Hero from "../Hero/Hero"
import ToasterMessage from "../ToasterMessage/ToasterMessage"
import toast from "react-hot-toast"
import EmptyState from "../EmptyState/EmptyState"
import ErrorState from "../ErrorMessage/ErrorMessage"
import MovieModal from "../MovieModal/MovieModal"

type AppState = "idle" | "loading" | "results" | "empty" | "error"

function App() {
  const [appState, setAppState] = useState<AppState>("idle")

  const [movies, setMovies] = useState<Movie[]>([])

  const [query, setQuery] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

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

  const onSelect = (movie: Movie): void => {
    setSelectedMovie(movie)
  }

  const handleCloseModal = (): void => {
    setSelectedMovie(null)
  }

  return (
    <>
      <ToasterMessage />

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

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default App
