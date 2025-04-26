import { useState } from "react"
import axiosInstance from "./axiosInstance"
import toast from "react-hot-toast"

export const SecretPage = () => {
  const [secret, setSecret] = useState("")

  const getSecret = async () => {
    try {
      const response = await axiosInstance.get("/secret")
      setSecret(response.data.secret)
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch secret. Please try again later.")
      }
    }
  }

  return (
    <div>
      <button
        className="btn-secondary"
        style={{ marginRight: "8px" }}
        onClick={() => setSecret("")}
      >
        Clear
      </button>
      <button className="btn-primary" onClick={getSecret}>
        Get secret
      </button>
      <h3 style={{ margin: "16px 0" }}>{secret}</h3>
    </div>
  )
}
