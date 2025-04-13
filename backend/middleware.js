export const validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false })
      next()
    } catch (error) {
      return res.status(400).json({
        name: error.name,
        message: error.message,
        errors: error.errors
      })
    }
  }
}
