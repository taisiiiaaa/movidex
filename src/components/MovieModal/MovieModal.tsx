import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { fetchMovieDetails } from "../../services/movieService"
import type { Movie, MovieDetails, ModalState } from "../../types/types"
import styles from "./MovieModal.module.css"
import Loader from "../Loader/Loader"

interface MovieModalProps {
  movie: Movie
  onClose: () => void
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const modalRoot = document.getElementById("modal-root")

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)

  const [modalState, setModalState] = useState<ModalState>("loading")

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setModalState("loading")

        const details = await fetchMovieDetails(movie.id)

        setMovieDetails(details)
        setModalState("ready")
      } catch (error) {
        console.error(error)
        setModalState("error")
      }
    }

    loadMovieDetails()
  }, [movie.id])

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

  if (!modalRoot) {
    return null
  }

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className={styles.dialog}
        role="dialog"
        aria-modal="true">
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
          {modalState === "loading" && (
            <div className={styles.info}>
              <Loader />
            </div>
          )}

          {modalState === "error" && (
            <div className={styles.info}>
              <p className={styles.overview}>Could not load full details.</p>
            </div>
          )}

          {modalState === "ready" && movieDetails && (
            <>
              <div className={styles.artwork}>
                {movieDetails.backdrop_path ? (
                  <img
                    className={styles.poster}
                    src={`https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path}`}
                    alt={`${movieDetails.original_title} poster`}
                    draggable={false}
                  />
                ) : (
                  <div className={styles.noPoster}>No poster available</div>
                )}
              </div>

              <div className={styles.info}>
                <h2 className={styles.title}>{movieDetails.original_title}</h2>

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

                  {movieDetails.runtime > 0 && (
                    <>
                      <span className={styles.metaSep} aria-hidden="true" />

                      <span className={styles.metaYear}>
                        {Math.floor(movieDetails.runtime / 60)}h{" "}
                        {movieDetails.runtime % 60}m
                      </span>
                    </>
                  )}
                </div>

                {movieDetails.genres.length > 0 && (
                  <div className={styles.genres} aria-label="Genres">
                    {movieDetails.genres.map((genre) => (
                      <span key={genre.id} className={styles.genreTag}>
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {movieDetails.overview && (
                  <div>
                    <p className={styles.overviewLabel}>Overview</p>
                    <p className={styles.overview}>{movieDetails.overview}</p>
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
