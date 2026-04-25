import { AppError } from "./app-error.js";

// utils/errors.js
export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details = null) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details = null) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details = null) {
    super(message, 404, "NOT_FOUND", details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", details = null) {
    super(message, 500, "INTERNAL_SERVER_ERROR", details);
  }
}

// conflict
export class ConflictError extends AppError {
  constructor(message = "Conflict", details = null) {
    super(message, 409, "CONFLICT", details);
  }
}

