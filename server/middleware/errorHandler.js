// server/middleware/errorHandler.js

function notFoundHandler(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || "Something went wrong" });
}

module.exports = { notFoundHandler, errorHandler };