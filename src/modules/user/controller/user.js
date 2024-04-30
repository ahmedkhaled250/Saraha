import {
  findById,
  findByIdAndUpdate,
  findOne,
  findOneAndUpdate,
  updateOne,
} from "../../../../DB/dbmethods.js";
import cloudinary from "../../../utils/cloudinary.js";
import userModel from "../../../../DB/models/user.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../../utils/errorHandling.js";
import sendEmail from "../../../utils/sendEmail.js";
import jwt from "jsonwebtoken"
export const profilePic = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
    folder: `Saraha/User/${user._id}`,
  });
  const updateUser = await findByIdAndUpdate({
    model: userModel,
    condition: user._id,
    data: { image: { public_id, secure_url } },
  });
  if (!updateUser) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("Fail to upload your photo", { cause: 400 }));
  }
  if (updateUser) {
    if (user.image) {
      await cloudinary.uploader.destroy(user.image.public_id);
    }
    return res.status(200).json({ message: "Done" });
  }
});
export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const updateUser = await findByIdAndUpdate({
    model: userModel,
    condition: user._id,
    data: { image: null },
  });
  if (!updateUser) {
    return next(new Error("Fail to delete your photo", { cause: 400 }));
  }
  if (updateUser) {
    if (user.image) {
      await cloudinary.uploader.destroy(updateUser.image.public_id);
    }
    return res.status(200).json({ message: "Done" });
  }
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await findById({ model: userModel, condition: req.user._id });
  const { oldPassword, password } = req.body;
  const match = bcrypt.compareSync(oldPassword, user.password);
  if (!match) {
    return next(new Error("Password miss match", { cause: 400 }));
  }
  const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
  await updateOne({
    model: userModel,
    condition: { _id: user._id },
    data: { password: hash },
  });
  return res.status(200).json({ message: "Done" });
});
export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
  const user = await findOneAndUpdate({
    model: userModel,
    condition: { email },
    data: { code },
  });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  const message = `
    <h3>Your code is : ${code}</h3>
    `;
  await sendEmail({ dest: user.email, subject: "Forget password", message });
  return res.status(200).json({ message: "Done" });
});
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;
  const user = await findOne({ model: userModel, condition: { email } });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (code != user.code) {
    return next(new Error("This code is wrong", { cause: 400 }));
  }
  const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
  await updateOne({
    model: userModel,
    condition: { email },
    data: { password: hash, code: null },
  });
  return res.status(200).json({ message: "Go to login" });
});
export const softdelete = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (user.stopped) {
    user.stopped = false
  } else {
    user.stopped = true
  }
  await user.save()
  return res.status(200).json({ message: "Done" });
});
export const updateUser = asyncHandler(async (req, res, next) => {
  const { email, userName, gender } = req.body;
  const { user } = req;
  if (email) {
    if (email === user.email) {
      return next(new Error("Already, this is your email", { cause: 403 }));
    }
    const token = jwt.sign({ id: user._id }, process.env.EMAILTOKEN, {
      expiresIn: 60 * 60,
    });
    const rToken = jwt.sign({ id: user._id }, process.env.EMAILTOKEN);
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const link2 = `${req.protocol}://${req.headers.host}/auth/refreshToken/${rToken}`;
    const message = `
              <a href="${link}">Cleck here to confirm your email</a>
              <br>
              <a href="${link2}">Request new Confirmation email</a>
              `;
    await sendEmail({
      dest: email,
      subject: "confirm email",
      message,
    });
    await updateOne({
      model: userModel,
      condition: { _id: user._id },
      data: { active: false, confirmEmail: false, changeTime: new Date(), email, gender, userName },
    });
  }
  await updateOne({
    model: userModel,
    condition: { _id: user._id },
    data: { userName, gender },
  });
  return res.status(200).json({ message: "Done" });
});
export const profile = asyncHandler(async (req, res, next) => {
  const { user } = req;
  return res.status(200).json({ message: "Done", user });
});
export const user = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await findById({
    model: userModel,
    condition: id,
  });
  return res.status(200).json({ message: "Done", user });
});
export const profileLink = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const link = `${req.protocol}://${req.headers.host}/user/${user._id}`;
  return res.status(200).json({ message: "Done", link });
});
