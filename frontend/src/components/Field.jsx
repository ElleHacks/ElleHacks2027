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
      {/* Kept together so grid layouts can line up labels and inputs separately */}
      <div className="field-body">
        {hint && <small className="hint">{hint}</small>}
        {children}
        {error && (
          <p className="error" id={`${name}-error`} role="alert">
            {error}
          </p>
        )}
      </div>
    </Wrapper>
  );
}

export default Field;
