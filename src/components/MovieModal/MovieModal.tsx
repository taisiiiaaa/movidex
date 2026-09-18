import { useEffect } from "react"
import { createPortal } from "react-dom"
import { fetchMovieDetails } from "../../services/movieService"
import type { Movie } from "../../types/movie"
import styles from "./MovieModal.module.css"
import Loader from "../Loader/Loader"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

interface MovieModalProps {
  movie: Movie
  onClose: () => void
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const modalRoot = document.getElementById("modal-root")

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movieDetails", movie.id],
    queryFn: () => fetchMovieDetails(movie.id),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!modalRoot) {
    return null
  }

  return createPortal(
    <div className={styles.backdrop} onClick={handleCloseModal}>
      <div className={styles.dialog} role="dialog" aria-modal="true">
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close movie details">
          <svg width="16" height="16" aria-hidden="true">
            <use href="./icons.svg#ic-cross" />
          </svg>
        </button>

        <div className={styles.body}>
          {isLoading && (
            <div className={styles.info}>
              <Loader />
            </div>
          )}

          {isError && (
            <div className={styles.info}>
              <p className={styles.overview}>Could not load full details.</p>
            </div>
          )}

          {data && (
            <>
              <div className={styles.artwork}>
                {data.backdrop_path ? (
                  <img
                    className={styles.poster}
                    src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
                    alt={`${data.original_title} poster`}
                    draggable={true}
                  />
                ) : (
                  <div className={styles.noPoster}>No poster available</div>
                )}
              </div>

              <div className={styles.info}>
                <h2 className={styles.title}>{data.original_title}</h2>

                <div className={styles.meta}>
                  {movie.release_date && (
                    <span className={styles.metaYear}>
                      {movie.release_date.slice(0, 4)}
                    </span>
                  )}

                  {movie.release_date && movie.vote_average > 0 && (
                    <span className={styles.metaSep} aria-hidden="true" />
                  )}

                  {movie.vote_average > 0 && (
                    <>
                      <svg
                        className={styles.star}
                        width="16"
                        height="16"
                        aria-hidden="true">
                        <use href="./icons.svg#ic-star" />
                      </svg>

                      <span>{movie.vote_average.toFixed(1)}</span>
                    </>
                  )}

                  {data.runtime > 0 && (
                    <>
                      <span className={styles.metaSep} aria-hidden="true" />

                      <span className={styles.metaYear}>
                        {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                      </span>
                    </>
                  )}
                </div>

                {data.genres.length > 0 && (
                  <div className={styles.genres} aria-label="Genres">
                    {data.genres.map((genre: { id: number; name: string }) => (
                      <span key={genre.id} className={styles.genreTag}>
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {data.overview && (
                  <div>
                    <p className={styles.overviewLabel}>Overview</p>
                    <p className={styles.overview}>{data.overview}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    modalRoot,
  )
}
