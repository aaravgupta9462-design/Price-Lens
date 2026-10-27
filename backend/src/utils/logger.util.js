/**
 * PriceLens Structured Logger Utility
 */
export const logger = {
  info(message, context = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${message}`, Object.keys(context).length ? context : '');
  },

  warn(message, context = {}) {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}] ${message}`, Object.keys(context).length ? context : '');
  },

  error(message, error = null, context = {}) {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}] ${message}`, {
      errorMessage: error?.message || error,
      stack: error?.stack,
      ...context
    });
  }
};

export default logger;
