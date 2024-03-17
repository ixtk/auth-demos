import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../UserModel.js"

export const jwtSimpleRouter = express.Router()

const verifyAccessToken = async (req, res, next) => {}

jwtSimpleRouter.get("/user/status", (req, res) => {
  res.status(401).json({ message: "status" })
})

jwtSimpleRouter.get("/secret", (req, res) => {
  return res.json({ secret: "2 x 2 = 4" })
})

jwtSimpleRouter.post("/user/register", async (req, res) => {
  const registerValues = req.body

  const hashedPassword = await bcrypt.hash(registerValues.password, 8)

  const newUser = new User({
    username: registerValues.username,
    email: registerValues.email,
    password: hashedPassword
  })

  await newUser.save()

  res.status(200).json({
    user: { username: newUser.username, email: newUser.email }
  })
})

jwtSimpleRouter.post("/user/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  const userObj = user.toObject()

  if (user && (await bcrypt.compare(password, userObj.password))) {
    const { password, ...rest } = userObj

    await user.save()

    res.status(200).json({ user: rest })
  } else {
    res.status(401).json({ message: "Invalid username or password" })
  }
})

jwtSimpleRouter.delete("/user/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out" })
})
