import { useEffect, useState } from "react"
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
import { useQuery } from "@tanstack/react-query"
import Pagination from "@mui/material/Pagination"

function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: Boolean(searchQuery),
  })

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies were found for your request.")
    }
  }, [data])

  const handleSubmit = async (query: string): Promise<void> => {
    setSearchQuery(query)
  }

  const handleRetry = () => {
    refetch()
  }

  const onSelect = (movie: Movie): void => {
    setSelectedMovie(movie)
  }

  const handleCloseModal = (): void => {
    setSelectedMovie(null)
  }

  const hasResults = data && data.results.length > 0
  const isEmpty = data && data.results.length === 0

  return (
    <>
      <ToasterMessage />

      <SearchBar onSubmit={handleSubmit} isLoading={isLoading} />
      <main>
        {!searchQuery && !isLoading && !isError && <Hero />}
        {isLoading && <Loader />}

        {isEmpty && searchQuery && <EmptyState query={searchQuery} />}
        {isError && searchQuery && (
          <ErrorState
            message={
              error instanceof Error ? error.message : "Something went wrong."
            }
            onRetry={handleRetry}
          />
        )}

        {hasResults && (
          <section className={styles.content}>
            <h2 className={styles.resultsHeading}>
              Results for "{searchQuery}"
            </h2>
            <MovieGrid movies={data.results} onSelect={onSelect} />
          </section>
        )}

        {!isEmpty && !isError && data && data.total_pages > 1 && (
          <Pagination
            count={data.total_pages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            size="medium"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBlock: "var(--space-8)",
              "& .MuiPaginationItem-root": {
                color: "var(--color-text-secondary)",
                borderRadius: "50%",
                transition:
                  "background-color var(--transition-fast), color var(--transition-fast)",
              },
              "& .MuiPaginationItem-root:hover, & .MuiPaginationItem-root:focus":
                { backgroundColor: "rgba(128, 128, 128, 0.25)" },
              "& .MuiPaginationItem-root.Mui-selected": {
                color: "var(--color-text)",
                backgroundColor: "var(--color-accent)",
                transition:
                  "background-color var(--transition-fast), color var(--transition-fast)",
              },
              "& .MuiPaginationItem-root.Mui-selected:hover, .MuiPaginationItem-root.Mui-selected:focus":
                { backgroundColor: "var(--color-accent-hover)" },
              "& .MuiPaginationItem-root.Mui-disabled": {
                color: "var(--color-text-muted)",
                opacity: 0.5,
              },
            }}
          />
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default App
