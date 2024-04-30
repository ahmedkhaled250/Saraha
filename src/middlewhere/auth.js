import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/errorHandling.js";
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
    const user = await findById({ model: userModel, condition: decoded.id, select: "-password" });
    const expireDate = parseInt(user.changeTime?.getTime() / 1000);
    if (expireDate > decoded.iat) {
      return next(new Error("Expire token", { cause: 400 }));
    }
    if(!user){
        return next(new Error("In-valid user",{cause:404}))
    }
    req.user = user
    return next()
  });
};
const GraphAuth = async(authorization) => {
    if (!authorization.startsWith(process.env.BARERKEY)) {
      return new Error("In-valid barer key");
    }
    const token = authorization.split(process.env.BARERKEY)[1];
    const decoded = jwt.verify(token, process.env.TOKENSEGNITURE);
    if (!decoded?.id) {
      return new Error("In-valid payload");
    }
  const user = await findById({ model: userModel, condition: decoded.id, select: "email code userName image" });
  if(!user){
    return new Error("In-valid user")
  }

    return user
};
export {auth ,GraphAuth}