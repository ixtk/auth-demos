import { useState } from "react"

export const SecretPage = () => {
  const [secret, setSecret] = useState("")

  const getSecret = async () => {
    // todo
  }

  return (
    <div className="page-container">
      <button onClick={getSecret}>Get secret</button>
      <h3>{secret}</h3>
    </div>
  )
}
