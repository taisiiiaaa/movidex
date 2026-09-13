import { Toaster } from "react-hot-toast"

export default function ErrorMessage() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        removeDelay: 1000,
        style: {
          background: "var(--color-elevated)",
          color: "var(--color-text)",
        },
      }}
    />
  )
}
