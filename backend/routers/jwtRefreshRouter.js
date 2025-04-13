import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../UserModel.js";
import { validateSchema } from "../middleware.js";
import { object, string, ref } from "yup";

const loginSchema = object({
  email: string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required(),
  password: string().min(8).required(),
});

const registerSchema = object({
  email: string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required(),
  username: string().min(3).max(20).required(),
  password: string().min(8).required(),
  confirmPassword: string()
    .oneOf([ref("password"), null], "Passwords do not match")
    .required("Password confirmation is required")
})

export const jwtRefreshRouter = express.Router();

const JWT_SECRET = "try to guess";

const verifyAccessToken = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  jwt.verify(req.cookies.accessToken, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // ამ user ატრიბუტს გამოვიყენებთ რიგით შემდეგ middleware/response-ებში
    req.user = decoded;

    next();
  });
};

jwtRefreshRouter.get("/user/status", verifyAccessToken, (req, res) => {
  return res.json({ user: req.user });
});

jwtRefreshRouter.get("/secret", verifyAccessToken, (req, res) => {
  return res.json({ secret: "2 x 2 = 4" });
});

jwtRefreshRouter.post("/user/register", validateSchema(registerSchema), async (req, res) => {
  const registerValues = req.body;

  const hashedPassword = await bcrypt.hash(registerValues.password, 8);

  const newUser = new User({
    username: registerValues.username,
    email: registerValues.email,
    password: hashedPassword,
  });

  const accessToken = jwt.sign(
    { username: newUser.username, email: newUser.email },
    JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );

  const refreshToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  newUser.refreshTokens.push(refreshToken);
  await newUser.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 1000 * 60 * 5,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.json({
    user: { username: newUser.username, email: newUser.email },
  });
});

jwtRefreshRouter.post("/user/login", validateSchema(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const userObj = user.toObject();

  if (user && (await bcrypt.compare(password, userObj.password))) {
    const { password, ...rest } = userObj;

    const accessToken = jwt.sign(
      { username: user.username, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const refreshToken = jwt.sign({ userId: rest._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 1000 * 60 * 5,
    });

    res.json({ user: rest });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

jwtRefreshRouter.post("/refresh", async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "unauthenticated" });
  }

  jwt.verify(refreshToken, JWT_SECRET, async (error, decoded) => {
    if (error) {
      res.clearCookie("refreshToken");
      return res.status(401).json({ message: "unauthenticated" });
    }

    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      res.clearCookie("refreshToken");
      return res.status(401).json({ message: "unauthenticated" });
    }

    const accessToken = jwt.sign(
      { username: user.username, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 1000 * 60 * 5,
    });

    res.json({ user: { username: user.username, email: user.email } });
  });
});

jwtRefreshRouter.delete("/user/logout", async (req, res) => {
  const { refreshToken } = req.cookies;

  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshTokens = [];
    await user.save();
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});
