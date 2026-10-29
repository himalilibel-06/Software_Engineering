/**
 * Single source for JWT signing and verification secret.
 */
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn(
      "[auth] JWT_SECRET is not set in environment. Using development fallback; set JWT_SECRET in backend/.env before production."
    );
    return "FIXED_SECRET_KEY_12345";
  }
  return secret;
}
