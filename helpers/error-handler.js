const appErrorHandler = (app) => {
  app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      Results: null,
      Success: false,
      ErrorMessage: error.message || "Internal server error",
    });
  });
};

module.exports = appErrorHandler;
