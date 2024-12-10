const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Show stack trace in dev mode
    });
  };
  
  export default errorHandler;
  