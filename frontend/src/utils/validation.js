export const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < 12) {
    return "Password must be at least 12 characters.";
  }
  if (new TextEncoder().encode(password).length > 72) {
    return "Password must be no more than 72 bytes.";
  }
  return "";
};

