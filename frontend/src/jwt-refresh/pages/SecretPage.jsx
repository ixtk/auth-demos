import { useState } from "react"
import { axiosInterceptorsInstance } from "../axiosInstance"

export const SecretPage = () => {
  const [secret, setSecret] = useState("")

  const getSecret = async () => {
    try {
      console.log("Starting to fetch secret")
      const response = await axiosInterceptorsInstance.get("/secret")
      console.log("Setting state", response.data.secret)
      setSecret(response.data.secret)
    } catch (error) {
      console.log("In the original catch block")
    }
  }

  return (
    <div className="page-container">
      <button onClick={() => setSecret("")} style={{ marginRight: "8px" }}>
        Clear
      </button>
      <button onClick={getSecret}>Get secret</button>
      <h3>{secret}</h3>
    </div>
  )
}
