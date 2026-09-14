import styles from "./ErrorMessage.module.css"

interface ErrorStateProps {
  message: string | undefined
  onRetry: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.container} role="alert">
      <svg className={styles.icon} width="32" height="32" aria-hidden="true">
        <use href="./icons.svg#ic-alert" />
      </svg>
      <h2 className={styles.heading}>Something went wrong</h2>
      <p className={styles.body}>
        {message ??
          "Unable to fetch movies. Please check your connection and try again."}
      </p>
      <button className={styles.retryBtn} onClick={onRetry}>
        <svg
          className={styles.iconRetry}
          width="18"
          height="18"
          aria-hidden="true">
          <use href="./icons.svg#ic-retry" />
        </svg>
        Try again
      </button>
    </div>
  )
}
