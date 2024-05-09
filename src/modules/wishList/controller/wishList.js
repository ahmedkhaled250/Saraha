import {
  findOne,
  updateOne,
} from "../../../../DB/dbmethods.js";
import messageModel from "../../../../DB/models/message.js";
import userModel from "../../../../DB/models/user.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
export const add = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const message = await findOne({ model: messageModel, condition: { _id: id, receiver: user._id } });
  if (!message) {
    return next(new Error("In-valid message id", { cause: 404 }));
  }
  const messageIds = []
  if (user.wishList.length) {
    for (const message of user.wishList) {
      messageIds.push(message._id.toString())
    }
  }
  if (messageIds.includes(message._id.toString())) {
    return next(new Error("this message in your wishlist", { cause: 400 }))
  }
  await updateOne({
    model: userModel,
    condition: { _id: user._id },
    data: {
      $push: {
        wishList: message._id
      }
    },
  });
  return res.status(200).json({ message: "Done" });
});
export const remove = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const message = await findOne({ model: messageModel, condition: { _id: id, receiver: user._id } });
  if (!message) {
    return next(new Error("In-valid message id", { cause: 404 }));
  }
  const messageIds = []
  if (user.wishList.length) {
    for (const message of user.wishList) {
      messageIds.push(message._id.toString())
    }
  }
  if (!messageIds.includes(message._id.toString())) {
    return next(new Error("This message is not in your wishList", { cause: 400 }));
  }
  await updateOne({
    model: userModel,
    condition: { _id: user._id },
    data: {
      $pull: {
        wishList: message._id
      }
    },
  });
  return res.status(200).json({ message: "Done" });
});