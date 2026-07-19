function errorHandler(err, req, res, next) {
    console.error(err && err.stack ? err.stack : err);

    const status = err.status || 500;

    // For server errors, do not leak internal messages to clients
    const message = status >= 500 ? "Internal Server Error" : (err.message || "Bad Request");

    res.status(status).json({
        success: false,
        message,
    });
}

module.exports = errorHandler;
