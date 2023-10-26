import jwt from "jsonwebtoken";
import { asyncHandler } from "../services/errorHandling.js";
import { findById } from "../../DB/dbmethods.js";
import userModel from "../../DB/models/user.js";
const auth = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization.startsWith(process.env.BARERKEY)) {
      return next(new Error("In-valid barer key", { cause: 400 }));
    }
    const token = authorization.split(process.env.BARERKEY)[1];
    const decoded = jwt.verify(token, process.env.TOKENSEGNITURE);
    if (!decoded?.id) {
      return next(new Error("In-valid payload", { cause: 400 }));
    }
    const user = await findById({ model: userModel, condition: decoded.id,select:"email code userName" });
    if(!user){
        return next(new Error("In-valid user",{cause:404}))
    }
    req.user = user
    return next()
  });
};
export default auth