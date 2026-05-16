import { User } from "../models/user.model.js";
import { verifyToken } from "../utils/token.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (request, response, next) => {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    throw new HttpError(401, "Authentication required");
  }

  const payload = verifyToken(token);
  const user = await User.findById(payload.id);

  if (!user) {
    throw new HttpError(401, "Authentication required");
  }

  request.user = user;
  next();
});
