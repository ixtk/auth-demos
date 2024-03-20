import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../UserModel.js"

const JWT_SECRET = "<your secret>"

export const jwtSimpleRouter = express.Router()

const verifyAccessToken = async (req, res, next) => {
  const { accessToken } = req.cookies

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthenticated" })
  }

  jwt.verify(accessToken, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Unauthenticated" })
    }

    // თუ middleware-ში ვართ...
    req.user = decoded // ⚠️
    next()
  })
}

jwtSimpleRouter.get("/user/status", verifyAccessToken, (req, res) => {
  res.json({ user: req.user })
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

  res.json({
    user: { username: newUser.username, email: newUser.email }
  })
})

jwtSimpleRouter.post("/user/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  const userObj = user.toObject()

  if (user && (await bcrypt.compare(password, userObj.password))) {
    const { password, ...rest } = userObj

    const accessToken = jwt.sign(rest, JWT_SECRET, {
      expiresIn: "1d"
    })

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "strict"
      })
      .json({ user: rest })
  } else {
    res.status(401).json({ message: "Invalid username or password" })
  }
})

jwtSimpleRouter.delete("/user/logout", async (req, res) => {
  res.clearCookie("accessToken")
  res.json({ message: "Logged out" })
})
