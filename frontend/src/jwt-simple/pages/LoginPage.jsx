import { Form, Formik, ErrorMessage, Field } from "formik"
import { Link } from "react-router-dom"
import { axiosInstance } from "../axiosInstance"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"

export const LoginPage = () => {
  const initialValues = {
    email: "",
    password: ""
  }
  const { authState, setAuthState } = useContext(AuthContext)

  const loginUser = async (loginValues, { setSubmitting }) => {
    const response = await axiosInstance.post("/user/login", loginValues)

    setAuthState({
      ...authState,
      user: response.data.user
    })

    console.log(response.data)
  }

  return (
    <div className="form-page-container">
      <h1>{authState.user?.username}</h1>
      <Formik initialValues={initialValues} onSubmit={loginUser}>
        {(formikProps) => {
          return (
            <Form className="form-container" autoComplete="off">
              <div>
                <label htmlFor="email">Email</label>
                <Field id="email" name="email" type="text" />
                <ErrorMessage name="email" component="span" />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <Field id="password" name="password" type="password" />
                <ErrorMessage name="password" component="span" />
              </div>
              <div className="form-aside">
                <span>
                  Don't have an account? <Link to="/register">Register</Link>
                </span>
                <button type="submit" disabled={formikProps.isSubmitting}>
                  {formikProps.isSubmitting ? "Loading..." : "Login"}
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
