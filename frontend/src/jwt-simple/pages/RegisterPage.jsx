import { Form, Formik, Field, ErrorMessage } from "formik"
import { axiosInstance } from "../axiosInstance"

export const RegisterPage = () => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  const registerUser = async (registerValues, { setSubmitting }) => {
    const response = await axiosInstance.post("/user/register", registerValues)
    console.log(response.data)
  }

  return (
    <div className="form-page-container">
      <Formik initialValues={initialValues} onSubmit={registerUser}>
        {(formikProps) => {
          return (
            <Form className="form-container" autoComplete="off">
              <div>
                <label htmlFor="username">Username</label>
                <Field id="username" name="username" type="text" />
                <ErrorMessage name="username" component="span" />
              </div>
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
              <div>
                <label htmlFor="confirmPassword">Confirm password</label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                />
                <ErrorMessage name="confirmPassword" component="span" />
              </div>
              <button
                type="submit"
                className="register-btn"
                disabled={formikProps.isSubmitting}
              >
                {formikProps.isSubmitting ? "Loading..." : "Register"}
              </button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
