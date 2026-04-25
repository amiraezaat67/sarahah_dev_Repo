export const responseFormatter = (handler) => {
  return async (req, res, next) => {
    try {
    // Call the handler
      const result = await handler(req, res, next);      

      // If response already sent manually → skip
      if (res.headersSent) return;

      // Standard success format
      return res.status(result?.meta?.statusCode || 200).json({
        success: true,
        message: result?.message || "Success",
        data: result?.data || result,
        meta: result?.meta || {}
      });

    } catch (err) {
      next(err); // forward to error handler
    }
  };
};
