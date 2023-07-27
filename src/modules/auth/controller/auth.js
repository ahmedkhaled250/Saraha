import userModel from "../../../../DB/models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../../services/sendEmail.js";
export const signup = async (req, res) => {
  try {
    const { userName, email, password, age, phone, gender } = req.body;
    const checkEmail = await userModel.findOne({ email }).select("email");
    if (checkEmail) {
      return res.status(409).json({ message: "Already there is this email" });
    }
    const hashPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALTROUND)
    );
    const newUser = new userModel({
      userName,
      email,
      password: hashPassword,
      age,
      phone,
      gender,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.EMAILTOKEN, {
      expiresIn: "1h",
    });
    const tokenRefresh = jwt.sign({ id: newUser._id }, process.env.EMAILTOKEN);
    const link1 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmemail/${token}`;
    const link2 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/Refreshtoken/${tokenRefresh}`;
    const message = `
  <a href='${link1}'>Click here confirm your email</a>
  <br>
  <a href='${link2}'>Click here to refresh token</a>
  `;
    const info = await sendEmail(
      newUser.email,
      "message from your hacker",
      message
    );
    if (!info?.accepted?.length) {
      return res.status(400).json({ message: "Please, enter correct email" });
    }
    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(400).json({ message: "Fail to signup" });
    }
    return res.status(201).json({ message: "Done", savedUser });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAILTOKEN);
    console.log(decoded);
    if (!decoded?.id) {
      return res.status(400).json({ message: "In-valid token payload" });
    }
    const checkUser = await userModel.findById(decoded.id);
    if (!checkUser) {
      return res.status(404).json({ message: "In-valid user" });
    }
    if (checkUser.confirmEmail) {
      return res
        .status(409)
        .json({ message: "Already you confirmed your email" });
    }
    const user = await userModel.findByIdAndUpdate(
      decoded.id,
      {
        confirmEmail: true,
      },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ message: "In-valid user" });
    }
    return res.status(200).json({ message: "Please, go to login" });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const refreshToken = async (req, res) => {
  try {
    const { tokenRefresh } = req.params;
    const decoded = jwt.verify(tokenRefresh, process.env.EMAILTOKEN);
    if (!decoded?.id) {
      return res.status(400).json({ message: "In-valid token payload" });
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "In-valid user" });
    }
    if (user.confirmEmail) {
      return res
        .status(409)
        .json({ message: "Already you confirmed your email" });
    }
    const token = jwt.sign({ id: user._id }, process.env.EMAILTOKEN, {
      expiresIn: 60 * 5,
    });
    const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmemail/${token}`;
    const message = `<a href='${link}'>Click here to conferm your email</a>`;
    await sendEmail(user.email, "Confirm email", message);
    return res
      .status(200)
      .json({ message: "Please, go to your gemail to confirm yor email" });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await userModel.findOne({ email });
    if (!checkEmail) {
      return res.status(404).json({ message: "This email not found" });
    }
    const match = bcrypt.compareSync(password, checkEmail.password);
    if (!match) {
      return res.status(400).json({ maessge: "This password miss match" });
    }
    const login = await userModel.updateOne(
      { _id: checkEmail._id },
      { active: true }
    );
    if (!login?.modifiedCount) {
      return res.status(400).json({ message: "Fail to login" });
    }
    const token = jwt.sign({ id: checkEmail._id }, process.env.TOKENSEGNITURE, {
      expiresIn: 60 * 60 * 24,
    });
    return res.status(200).json({ message: "Done", token });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const logout = async (req, res) => {
  try {
    const { user } = req;
    if (!user.active) {
      return res.status(400).json({ message: "You've to be logged in" });
    }
    const logOut = await userModel.updateOne(
      { _id: user._id },
      { active: false }
    );
    if (!logOut?.modifiedCount) {
      return res.status(400).json({ message: "Fail to logged out" });
    }
    return res.status(200).json({ message: "Done" });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
