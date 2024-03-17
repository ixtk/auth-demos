import { useState } from "react"
import { axiosInstance, axiosInterceptorsInstance } from "../axiosInstance"

export const SecretPage = () => {
  const [secret, setSecret] = useState("")

  const getSecret = async () => {
    const response = await axiosInterceptorsInstance("/secret")
    setSecret(response.data.message)
  }

  return (
    <div className="page-container">
      <button onClick={getSecret}>Get secret</button>
      <h3>{secret}</h3>
    </div>
  )
}
