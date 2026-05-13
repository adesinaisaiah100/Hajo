class AppError extends Error {
  constructor(message, statusCode = 500, details = undefined) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || 'Internal server error'
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (err.code === 'P2002') {
    payload.message = 'A record with that value already exists';
    return res.status(409).json(payload);
  }

  if (err.code === 'P2025') {
    payload.message = 'Resource not found';
    return res.status(404).json(payload);
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  AppError,
  notFound,
  errorHandler
};