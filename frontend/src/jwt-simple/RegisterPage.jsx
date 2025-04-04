import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import "../common/Auth.scss"
import { useNavigate } from "react-router"
import { Form } from "../common/Form"
import { useFormik } from "formik"
import { string, object, ref } from "yup"
import { axiosInstance } from "./axiosInstance"

export const RegisterPage = () => {
  const { setAuth } = useContext(AuthContext)
  const navigate = useNavigate()

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

  const registerUser = async (values) => {
    const response = await axiosInstance.post("/user/register", values)
    const json = response.data

    setAuth({
      user: {
        username: json.username,
        email: json.email
      }
    })

    navigate("/")
  }

  const form = useFormik({
    initialValues: {
      password: "",
      email: "",
      username: "",
      confirmPassword: ""
    },
    onSubmit: registerUser,
    validationSchema: registerSchema
  })

  const fields = [
    { name: "username", placeholder: "", type: "text" },
    { name: "email", placeholder: "abc@company.com", type: "text" },
    { name: "password", placeholder: "", type: "password" },
    {
      label: "confirm password",
      name: "confirmPassword",
      placeholder: "",
      type: "password"
    }
  ]

  return (
    <Form
      description="Enter your information to create an account"
      title="Register"
      onSubmit={registerUser}
      fields={fields}
      form={form}
    />
  )
}
