// Label + hint + error wrapper shared by every form question
function Field({ label, name, required = false, error, hint, children, as = "div" }) {
  const Wrapper = as;
  const Label = as === "fieldset" ? "legend" : "label";

  return (
    <Wrapper className="field" id={`field-${name}`}>
      <Label htmlFor={as === "fieldset" ? undefined : name}>
        {label}
        {required && <span className="required"> *</span>}
      </Label>
      {hint && <small className="hint">{hint}</small>}
      {children}
      {error && (
        <p className="error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </Wrapper>
  );
}

export default Field;
