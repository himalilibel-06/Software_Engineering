import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../lib/jwtSecret.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const verified = jwt.verify(token, getJwtSecret());

    req.user = {
      ...verified,
      id: verified.id || verified.userId,
      userId: verified.userId || verified.id
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};
