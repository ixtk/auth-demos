import { object, string, ref } from "yup"

export const loginSchema = object({
  email: string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required(),
  password: string().min(8).required()
})

export const registerSchema = object({
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
