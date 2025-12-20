import React from 'react';

const FormInput = React.forwardRef(({ label, type = 'text', error, ...props }, ref) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        ref={ref}
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
});

export default FormInput;