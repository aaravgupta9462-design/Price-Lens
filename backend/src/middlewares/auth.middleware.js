import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import prisma from '../config/db.js';

/**
 * Authentication Middleware
 * 
 * 1. Reads Bearer token from 'Authorization' request header
 * 2. Verifies token validity and signature using config.jwtSecret
 * 3. Extracts user identifier (id/userId/sub) from payload
 * 4. Validates user existence in database when database is connected
 * 5. Attaches authenticated user payload ({ id, email, fullName }) to req.user
 * 6. Returns HTTP 401 for missing, invalid, expired tokens or nonexistent users
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'UNAUTHORIZED',
        message: 'Authentication token missing or invalid format.'
      });
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'UNAUTHORIZED',
        message: 'Authentication token missing.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          error: 'UNAUTHORIZED',
          message: 'Authentication token has expired.'
        });
      }
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'UNAUTHORIZED',
        message: 'Invalid authentication token.'
      });
    }

    const userId = decoded.id || decoded.userId || decoded.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'UNAUTHORIZED',
        message: 'Invalid authentication token payload.'
      });
    }

    let dbUser = null;
    let dbChecked = false;

    if (prisma) {
      try {
        dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true
          }
        });
        dbChecked = true;
      } catch (dbErr) {
        console.warn('[auth.middleware] Database query skipped:', dbErr.message);
      }
    }

    if (dbChecked && !dbUser) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'UNAUTHORIZED',
        message: 'User associated with token no longer exists.'
      });
    }

    const userPayload = dbUser || {
      id: userId,
      email: decoded.email || null,
      fullName: decoded.fullName || decoded.name || 'Authenticated User'
    };

    req.user = {
      id: userPayload.id,
      email: userPayload.email,
      fullName: userPayload.fullName
    };

    return next();
  } catch (err) {
    next(err);
  }
};

export default authenticateUser;
