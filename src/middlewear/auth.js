import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.js";
const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization?.startsWith(process.env.BARERKEY)) {
        return res.status(404).json({ message: "In-valid Barer key" });
      }
      const token = authorization.split(process.env.BARERKEY)[1];
      const decoded = jwt.verify(token, process.env.TOKENSEGNITURE);
      if (!decoded?.id) {
        return res.status(400).json({ message: "In-valid token payload" });
      }
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "In-valid user" });
      } else {
        if (user.active) {
          req.user = user;
          return next();
        } else {
          res.status(400).json({ message: "You've to be logged in" });
        }
      }
    } catch (err) {
      return res.status(500).json({ message: "Catch error", err });
    }
  };
};
export default auth;
