export const Form = ({ title, description, fields, onSubmit, form }) => {
  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={form.handleSubmit}>
        <h2 className="form-title">{title}</h2>
        <p className="form-desc">{description}</p>
        {fields.map((field) => {
          return (
            <div className="input-group">
              <label>{field.label || field.name}</label>
              <input
                {...form.getFieldProps(field.name)}
                placeholder={field.placeholder}
                type={field.type}
              />
              <span className="error">
                {form.touched[field.name] && form.errors[field.name]}
              </span>
            </div>
          )
        })}
        <button className="submit-btn">{title}</button>
      </form>
    </div>
  )
}
