import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"

import { User } from "../UserModel.js"

export const sessionRouter = express.Router()

sessionRouter.use(
  session({
    secret: "super secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 3
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/auth-demos"
    })
  })
)

const verifyAuth = async () => {
  // todo
}

sessionRouter.post("/user/register", async (req, res) => {
  // todo
})

sessionRouter.post("/user/login", async (req, res) => {
  // todo
})

sessionRouter.delete("/user/logout", async (req, res) => {
  // todo
})

sessionRouter.get("/user/auth", async (req, res) => {
  // todo
})
