export default function Input({
  label,
  error,
  hint,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input className={`form-input ${error ? "input-error" : ""}`} {...props} />
      {error && <small className="form-error">{error}</small>}
      {!error && hint && <small className="form-hint">{hint}</small>}
    </div>
  );
}
