import styles from "./Hero.module.css"

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Find your next movie</h1>
      <p className={styles.subtitle}>
        Search thousands of movies by title or keyword.
      </p>
    </section>
  )
}
