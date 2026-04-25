// utils/AppError.js
export class AppError extends Error {
  constructor(message = "An error occurred", statusCode = 500, code = "INTERNAL_ERROR", details = null) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

