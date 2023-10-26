import {
  create,
  findById,
  findByIdAndDelete,
} from "../../../../DB/dbmethods.js";
import messageModel from "../../../../DB/models/message.js";
import userModel from "../../../../DB/models/user.js";
import { asyncHandler } from "../../../services/errorHandling.js";
export const addMessage = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;
  const receiver = await findById({ model: userModel, condition: id });
  if (!receiver) {
    return next(new Error("In-valid receiver", { cause: 404 }));
  }
  await create({
    model: messageModel,
    data: { receiver: id, text, date: new Date() },
  });
  return res.status(201).json({ message: "Done" });
});
export const messages = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const messages = await find({
    model: messageModel,
    condition: { receiver: user._id },
  });
  if (!messages.length) {
    return next(new Error("In-valid messages", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", messages });
});
export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const message = await findByIdAndDelete({
    model: messageModel,
    condition: { receiver: user._id, _id: id },
  });
  if (!message) {
    return next(new Error("In-valid message", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done" });
});
