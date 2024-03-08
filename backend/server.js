import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
import mongoose from "mongoose"
import { sessionRouter } from "./routers/sessionsRouter.js"

const app = express()

app.use(cookieparser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
)
app.use(express.json())

app.use("/sessions", sessionRouter)

app.listen(3000, async () => {
  console.log("Server running on port 3000")

  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/auth-demos")
    console.log("Connected to the database: auth-demos")
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})