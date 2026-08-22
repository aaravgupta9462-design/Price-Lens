import { config } from '../config/env.js';

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    statusCode,
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message
  };

  if (config.nodeEnv === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
