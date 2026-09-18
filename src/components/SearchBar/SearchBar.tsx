import toast from "react-hot-toast"
import styles from "./SearchBar.module.css"

interface SearchBarProps {
  onSubmit: (query: string) => void
  isLoading: boolean
}

export default function SearchBar({ onSubmit, isLoading }: SearchBarProps) {
  const handleSubmit = (formData: FormData) => {
    const searchInput = formData.get("query") as string

    if (!searchInput) {
      toast.error("Please enter your search query.")
      return
    }

    if (typeof searchInput !== "string") {
      return
    }

    onSubmit(searchInput)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.logo} aria-label="Moviedex">
          <div className={styles.logoMark} aria-hidden="true">
            <svg width="26" height="26" aria-hidden="true">
              <use href="/icons.svg#ic-logo" />
            </svg>
          </div>
          <span className={styles.logoWord}>
            Movi<span>dex</span>
          </span>
        </a>
        <form action={handleSubmit} className={styles.searchForm}>
          <input
            className={styles.searchInput}
            type="text"
            name="query"
            placeholder="Search movies..."
            autoFocus
          />
          <button
            disabled={isLoading}
            className={styles.searchBtn}
            type="submit">
            <span className={styles.searchBtnText}>Search</span>
            <svg
              className={styles.searchBtnIcon}
              width="18"
              height="18"
              aria-label="Search">
              <use href="/icons.svg#ic-search" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  )
}
