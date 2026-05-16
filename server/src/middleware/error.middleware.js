import { HttpError } from "../utils/httpError.js";

export function notFound(request, response, next) {
  next(new HttpError(404, "Route not found"));
}

export function handleError(error, request, response, next) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong" : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  response.status(statusCode).json({ message });
}
