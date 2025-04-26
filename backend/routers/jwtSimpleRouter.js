import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../UserModel.js"
import {loginSchema, registerSchema} from "../userSchema.js"
import { validateSchema } from "../middleware.js"

const JWT_SECRET = "<your secret>"

export const jwtSimpleRouter = express.Router()

const verifyAccessToken = async (req, res, next) => {
  const { accessToken } = req.cookies

  if (!accessToken) {
    return res.status(401).json({ user: null, message: "Unauthenticated" })
  }

  jwt.verify(accessToken, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ user: null, message: "Unauthenticated" })
    }

    req.user = decoded
    next()
  })
}

jwtSimpleRouter.get("/user/status", verifyAccessToken, (req, res) => {
  res.json({ user: req.user })
})

jwtSimpleRouter.get("/secret", verifyAccessToken, (req, res) => {
  return res.json({ secret: "2 x 2 = 4" })
})

jwtSimpleRouter.post("/user/register", validateSchema(registerSchema), async (req, res) => {
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

jwtSimpleRouter.post("/user/login", validateSchema(loginSchema), async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  const userToEncode = {
    username: user.username,
    email: user.email,
    _id: user._id.toString()
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(userToEncode, JWT_SECRET, {
      expiresIn: "1d"
    })

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "strict"
      })
      .json({ user: userToEncode })
  } else {
    res.status(401).json({ message: "Invalid username or password" })
  }
})

jwtSimpleRouter.delete("/user/logout", async (req, res) => {
  res.clearCookie("accessToken")
  res.json({ message: "Logged out" })
})
