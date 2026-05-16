import { HttpError } from "../utils/httpError.js";

export function validate(schema) {
  return (request, response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      const message = result.error.errors.map((error) => error.message).join(", ");
      return next(new HttpError(400, message));
    }

    request.body = result.data;
    next();
  };
}
