import userModel from "../../../../DB/models/user.js";
import sendEmail from "../../../services/sendEmail.js";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../../../services/cloudinary.js";
export const updateProfile = async (req, res) => {
  try {
    const { userName, email, age, phone, gender } = req.body;
    const { user } = req;
    if (email) {
      if (user.email == email) {
        return res
          .status(409)
          .json({ message: "Already this email is your email" });
      }
      const checkEmail = await userModel.findOne({ email });
      if (checkEmail) {
        return res.status(409).json({ message: "This email is already exist" });
      }
      await userModel.updateOne(
        { _id: user._id },
        {
          active: false,
          confirmEmail: false,
        }
      );
      const token = jwt.sign({ id: user._id }, process.env.EMAILTOKEN, {
        expiresIn: "1h",
      });
      const tokenRefresh = jwt.sign({ id: user._id }, process.env.EMAILTOKEN);
      const link1 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmemail/${token}`;
      const link2 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/Refreshtoken/${tokenRefresh}`;
      const message = `
    <a href='${link1}'>Click here confirm your email</a>
    <br>
    <a href='${link2}'>Click here to refresh token</a>
    `;
      const info = await sendEmail(
        user.email,
        "message from your hacker",
        message
      );
      if (!info?.accepted?.length) {
        return res.status(400).json({ message: "Please, enter correct email" });
      }
    }
    const updateUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        userName,
        email,
        age,
        phone,
        gender,
      },
      {
        new: true,
      }
    );
    if (!updateUser) {
      return res.status(400).json({ message: "Fail to update user" });
    }
    return res.status(200).json({ message: "Done", user: updateUser });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, password } = req.body;
    const { user } = req;
    const match = bcrypt.compareSync(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "This password miss match" });
    }
    const hashPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALTROUND)
    );
    const updateUser = await userModel.updateOne(
      { _id: user._id },
      { password: hashPassword }
    );
    if (!updateUser?.modifiedCount) {
      return res.status(400).json({ message: "Fail to update password" });
    }
    return res.status(200).json({ message: "Done" });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const deleteProfile = async (req, res) => {
  try {
    const { user } = req;
    const dUser = await userModel.findByIdAndDelete(user._id);
    if (!dUser) {
      return res.status(400).json({ message: "Fail to delete user" });
    }
    return res.status(200).json({ message: "Done" });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const softDeleteProfile = async (req, res) => {
  try {
    const { user } = req;
    let updateUser;
    if (user.deleted) {
      updateUser = await userModel.findByIdAndUpdate(user._id, {
        deleted: false,
      });
    } else {
      updateUser = await userModel.findByIdAndUpdate(user._id, {
        deleted: true,
      });
    }
    if (!updateUser) {
      return res.status(400).json({ message: "Fail to update" });
    }
    return res.status(200).json({ message: "Done", user: updateUser });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { user } = req;
    return res.status(200).json({ message: "Done", user });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const users = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({ message: "Done", users });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await userModel.findOne({ email });
    if (!checkEmail) {
      return res.status(404).json({ message: "This email is not exist" });
    } else if (!checkEmail.confirmEmail) {
      return res.status(400).json({ message: "Please confirm your email" });
    }
    const code = nanoid();
    const message = `<h1>your code is :${code}</h1>`;
    await sendEmail(email, "Forget password", message);
    await userModel.updateOne({ _id: checkEmail._id }, { code });
    return res.status(200).json({ message: "Please, Get your code " });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const forgetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    const hashPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALTROUND)
    );
    const user = await userModel.findOneAndUpdate(
      { email, code },
      { code: null, password: hashPassword },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "This code is rong" });
    }
    return res.status(200).json({ message: "Done" });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const profilePic = async (req, res) => {
  try {
    const { user } = req;
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Saraha/user/${user._id}`,
      }
    );
    const updateUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        profilePic: secure_url,
        publicId: public_id,
      },
      {
        new: true,
      }
    );
    if (!updateUser) {
      await cloudinary.uploader.destroy(public_id);
      return res.status(200).json({ message: "Fail to add profile pictur" });
    }
    if (user.profilePic) {
      await cloudinary.uploader.destroy(user.publicId);
    }
    return res.status(200).json({ message: "Done", user: updateUser });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const shareprofile = async (req, res) => {
  try {
    const { user } = req;
    if (user.deleted) {
      return res.status(400).json({ message: "You deleted your profile" });
    }
    const url = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/user/sharelinkprofile/${user._id}`;
    return res.status(200).json({ message: "Done", url });
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
export const sharelinkprofile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel
      .findById(id)
      .select("userName email gender age phone");
    user
      ? res.json({ message: "Done", user })
      : res.json({ message: "In-valid account" });
  } catch (error) {
    res.json({ message: "Catch error", error });
  }
};
