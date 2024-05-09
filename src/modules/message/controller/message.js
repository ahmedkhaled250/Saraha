import {
  create,
  find,
  findById,
  findByIdAndDelete,
  findOne,
  updateOne,
} from "../../../../DB/dbmethods.js";
import messageModel from "../../../../DB/models/message.js";
import userModel from "../../../../DB/models/user.js";
import ApiFeatures from "../../../utils/apiFeatures.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
export const addMessage = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;
  const receiver = await findOne({ model: userModel, condition: { _id: id, stopped: false } });
  if (!receiver) {
    return next(new Error("In-valid receiver", { cause: 404 }));
  }
  await create({
    model: messageModel,
    data: { receiver: id, text, date: new Date() },
  });
  return res.status(201).json({ message: "Done" });
});
export const addAuthMessage = asyncHandler(async (req, res, next) => {
  const { user } = req
  const { text } = req.body;
  const { id } = req.params;
  if (user.stopped) {
    return next(new Error("Your account is stopped", { cause: 400 }))
  }
  const receiver = await findOne({ model: userModel, condition: { _id: id, stopped: false } });
  if (!receiver) {
    return next(new Error("In-valid receiver", { cause: 404 }));
  }
  await create({
    model: messageModel,
    data: { receiver: id, text, date: new Date(), sender: user._id },
  });
  return res.status(201).json({ message: "Done" });
});
export const receivedMessages = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const populate = [
    {
      path: "receiver",
      select: "userName email image",
    },
  ]
  const apiFeature = new ApiFeatures(
    req.query,
    messageModel.find({ receiver: user._id }).populate(populate).select("-sender")
  )
    .paginate()
    .sort()
  const messages = await apiFeature.mongooseQuery;
  if (!messages.length) {
    return next(new Error("In-valid messages", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", messages });
});
export const sentMessages = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const populate = [
    {
      path: "receiver",
      select: "userName email image",
    },
  ]
  const apiFeature = new ApiFeatures(
    req.query,
    messageModel.find({ sender: user._id }).populate(populate)
  )
    .filter()
    .paginate()
    .sort()
    .select()
    .search();
  const messages = await apiFeature.mongooseQuery;
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
  const messageIds = []
  if (user.wishList.length) {
    for (const message of user.wishList) {
      messageIds.push(message._id.toString())
    }
  }
  if (messageIds.includes(message._id)) {
    await updateOne({ model: userModel, condition: { _id: user._id }, data: { $pull: { wishList: message._id } } })
  }
  return res.status(200).json({ message: "Done" });
});
