import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Sign a JWT payload with standard application secret and expiration
 * @param {Object} payload - Data to embed in token (e.g. { id, email })
 * @param {string} expiresIn - Optional custom expiration (defaults to config.jwtExpiresIn)
 * @returns {string} Signed JWT token
 */
export const generateToken = (payload, expiresIn = config.jwtExpiresIn) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
};

/**
 * Verify a JWT token string against application secret
 * @param {string} token - JWT token string
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

export default {
  generateToken,
  verifyToken
};
