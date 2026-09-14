import type Movie from "../../types/movie"
import styles from "./MovieGrid.module.css"

interface MovieGridProps {
  onSelect: (movie: Movie) => void
  movies: Movie[]
}

export default function MovieGrid({ onSelect, movies }: MovieGridProps) {
  return (
    <ul className={styles.grid}>
      {movies.map((movie: Movie) => (
        <li className={styles.card} key={movie.id}>
          <a onClick={() => onSelect(movie)} aria-label={movie.title}>
            <div className={styles.posterWrapper}>
              {movie.poster_path ? (
                <img
                  className={styles.poster}
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                />
              ) : (
                <div className={styles.noPoster} aria-hidden="true">
                  <span>{movie.title}</span>
                </div>
              )}

              <div className={styles.overlay} aria-hidden="true">
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
              </div>
            </div>
            <div className={styles.info}>
              <p className={styles.title}>{movie.title}</p>
              <p className={styles.year}>
                {movie.release_date ? movie.release_date.slice(0, 4) : null}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
