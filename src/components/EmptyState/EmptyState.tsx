import styles from "./EmptyState.module.css"

interface EmptyStateProps {
  query: string
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className={styles.container} role="status">
      <svg className={styles.icon} width="32" height="32" aria-hidden="true">
        <use href="./icons.svg#ic-not-found" />
      </svg>
      <h2 className={styles.heading}>No movies found</h2>
      <p className={styles.body}>
        We couldn't find any results for <strong>"{query}"</strong>. Try a
        different title or keyword.
      </p>
    </div>
  )
}
