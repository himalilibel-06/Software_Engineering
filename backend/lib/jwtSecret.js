/**
 * Single source for JWT signing and verification secret.
 */
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FATAL: JWT_SECRET environment variable is missing. It must be explicitly configured in production for security."
      );
    }
    console.warn(
      "[auth] JWT_SECRET is not set in environment. Using development fallback; configure JWT_SECRET in backend/.env for production security."
    );
    return "FIXED_SECRET_KEY_12345";
  }

  if (process.env.NODE_ENV === "production" && (secret === "change_me_to_a_long_random_secret" || secret === "FIXED_SECRET_KEY_12345")) {
    throw new Error(
      "FATAL: JWT_SECRET is using an insecure default placeholder in production. Please set a secure random key."
    );
  }

  return secret;
}
