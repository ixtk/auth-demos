import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import bcrypt from "bcrypt"

import { User } from "../UserModel.js"

export const sessionRouter = express.Router()

sessionRouter.use(
  session({
    // HIDE IN PROD!
    secret: "super secret",
    resave: false,
    saveUninitialized: false,
    // rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 3,
      httpOnly: true
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/auth-demos",
      stringify: false
    })
  })
)

const verifyAuth = async (req, res, next) => {
  // console.log(req.session)
  if (req.session.userId) {
    req.user = await User.findById(req.session.userId).select("-password")
    next()
  } else {
    // else-ში მოვაქციეთ, next()-ის შემდეგ ეს პასუხიც რომ არ გაეშვას
    return res.status(401).json({ message: "Unauthenticated" })
  }
}

sessionRouter.get("/secret", verifyAuth, (req, res) => {
  console.log("Not logged if user is unauthenticated")
  res.json({ secret: "2 x 2 = 4" })
})

sessionRouter.post("/user/register", async (req, res) => {
  const registerValues = req.body

  const hashedPassword = await bcrypt.hash(registerValues.password, 12)

  const newUser = await User.create({
    username: registerValues.username,
    email: registerValues.email,
    password: hashedPassword
  })
  req.session.userId = newUser._id.toString()

  res.status(201).json({
    user: {
      username: newUser.username,
      email: newUser.email
    }
  })
})

sessionRouter.post("/user/login", async (req, res) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email }).exec()

  if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
    req.session.userId = existingUser._id.toString()
    return res.json({
      message: "Logged in",
      user: {
        username: existingUser.username,
        email: existingUser.email
      }
    })
  }

  res.status(401).json({ message: "Email or password incorrect" })
})

sessionRouter.delete("/user/logout", async (req, res) => {
  req.session.destroy()
  res.clearCookie("connect.sid")

  res.json({ message: "Logged out" })
})

sessionRouter.get("/user/status", verifyAuth, async (req, res) => {
  // სატესტო დაყოვნებისთვის
  // await fetch('http://httpbin.org/delay/2')

  res.json({ user: req.user })
})
