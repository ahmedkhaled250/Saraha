import { asyncHandler } from "../../../utils/errorHandling.js";
import {
  findById,
  findByIdAndUpdate,
  findOne,
  updateOne,
} from "../../../../DB/dbmethods.js";
import userModel from "../../../../DB/models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../../utils/sendEmail.js";
export const signup = asyncHandler(async (req, res, next) => {
  const { email, password, userName, gender } = req.body;
  const checkEmail = await findOne({ model: userModel, condition: { email } });
  if (checkEmail) {
    return next(new Error("Email exist", { cause: 409 }));
  }
  const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
  const newUser = new userModel({ email, password: hash, userName, gender });
  const token = jwt.sign({ id: newUser._id }, process.env.EMAILTOKEN, {
    expiresIn: 60 * 60,
  });
  const rToken = jwt.sign({ id: newUser._id }, process.env.EMAILTOKEN);
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const link2 = `${req.protocol}://${req.headers.host}/auth/refreshToken/${rToken}`;
  const message = `
          <a href="${link}">Cleck here to confirm your email</a>
          <br>
          <a href="${link2}">Request new Confirmation email</a>
          `;
  const info = await sendEmail({
    dest: email,
    subject: "Confirm email",
    message,
  });
  if (info.accepted.length) {
    await newUser.save();
    return res.status(201).json({ message: "Done", id: newUser._id });
  } else {
    return next(new Error("Enter correct email", { cause: 400 }));
  }
});
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.EMAILTOKEN);
  if (!decoded?.id) {
    return next(new Error("In-valid token payload", { cause: 400 }));
  }
  const user = await findByIdAndUpdate({
    model: userModel,
    condition: decoded.id,
    data: { confirmEmail: true },
  });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  return res.status(200).redirect(process.env.LOGINPAGE)
});
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.EMAILTOKEN);
  if (!decoded?.id) {
    return next(new Error("In-valid token payload", { cause: 400 }));
  }
  const user = await findById({ model: userModel, condition: decoded.id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const message = `
  <a href="${link}">click here to confirm your email</a>
  `;
  await sendEmail({ dest: user.email, subject: "confirmEmail", message });
  return res.status(200).json({ message: "Done" });
});
export const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne({ model: userModel, condition: { email } });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("Confirm your email first", { cause: 400 }));
  }
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new Error("Password miss match", { cause: 400 }))
  }
  await updateOne({
    model: userModel,
    condition: { _id: user._id },
    data: { active: true },
  });
  const token = jwt.sign({ id: user._id }, process.env.TOKENSEGNITURE, {
    expiresIn: "1d",
  });
  return res.status(200).json({ message: "Done", token });
});
export const signout = asyncHandler(async (req, res, next) => {
  const { user } = req;
  user.active = false
  user.changeTime = new Date()
  await user.save()
  return res.status(200).json({ message: "Done" })
});
