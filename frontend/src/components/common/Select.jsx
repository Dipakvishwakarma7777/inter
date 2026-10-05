export default function Select({
  label,
  options = [],
  error,
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
      <select className={`form-input ${error ? "input-error" : ""}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <small className="form-error">{error}</small>}
    </div>
  );
}
