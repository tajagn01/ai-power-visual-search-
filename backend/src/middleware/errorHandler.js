const logger = require('./logger')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = { message, statusCode: 400 }
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large. Maximum size is 5MB'
    error = { message, statusCode: 400 }
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field'
    error = { message, statusCode: 400 }
  }

  // Python service errors
  if (err.code === 'ENOENT' && err.message.includes('python')) {
    const message = 'Python service not available'
    error = { message, statusCode: 503 }
  }

  // RapidAPI errors
  if (err.response && err.response.status === 401) {
    const message = 'Invalid API key'
    error = { message, statusCode: 401 }
  }

  if (err.response && err.response.status === 429) {
    const message = 'API rate limit exceeded'
    error = { message, statusCode: 429 }
  }

  // Default error
  const statusCode = error.statusCode || 500
  const message = error.message || 'Server Error'

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler 