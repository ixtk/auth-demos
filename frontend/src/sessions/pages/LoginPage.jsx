import { Form, Formik, ErrorMessage, Field } from "formik"
import { Link } from "react-router-dom"

export const LoginPage = () => {
  const initialValues = {
    email: "",
    password: ""
  }

  const loginUser = async (loginValues, { setSubmitting }) => {
    // todo
  }

  return (
    <div className="form-page-container">
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
