const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors?.map(e => ({ field: e.path, message: e.message })),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  const status = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Something went wrong. Please try again.'
    : err.message || 'Internal server error';

  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
