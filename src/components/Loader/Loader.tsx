import { ThreeDots } from "react-loader-spinner"

export default function Loader() {
  return (
    <ThreeDots
      visible={true}
      height="120"
      width="40"
      color="var(--color-accent)"
      radius="16"
      ariaLabel="three-dots-loading"
      wrapperStyle={{ display: "flex", justifyContent: "center" }}
    />
  )
}
