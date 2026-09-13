import { createPortal } from "react-dom"
import type { ModalState, MovieDetails } from "../../types/movie"
import styles from "./MovieModal.module.css"
import Loader from "../Loader/Loader"
import { useEffect } from "react"

interface MovieModalProps {
  movie: MovieDetails | null
  onClose: () => void
  modalState: ModalState
}

export default function MovieModal({
  movie,
  onClose,
  modalState,
}: MovieModalProps) {
  const modalRoot = document.getElementById("modal-root")

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

          {modalState === "ready" && movie && (
            <>
              <div className={styles.artwork}>
                {movie.backdrop_path ? (
                  <img
                    className={styles.poster}
                    src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                    alt={`${movie.original_title} poster`}
                    draggable={false}
                  />
                ) : (
                  <div className={styles.noPoster}>No poster available</div>
                )}
              </div>

              <div className={styles.info}>
                <h2 className={styles.title}>{movie.original_title}</h2>

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

                  {movie.runtime > 0 && (
                    <>
                      <span className={styles.metaSep} aria-hidden="true" />

                      <span className={styles.metaYear}>
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    </>
                  )}
                </div>

                {movie.genres.length > 0 && (
                  <div className={styles.genres} aria-label="Genres">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className={styles.genreTag}>
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {movie.overview && (
                  <div>
                    <p className={styles.overviewLabel}>Overview</p>
                    <p className={styles.overview}>{movie.overview}</p>
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
