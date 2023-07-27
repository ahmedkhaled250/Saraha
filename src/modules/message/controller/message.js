import messageModel from "../../../../DB/models/message.js";
import userModel from "../../../../DB/models/user.js";

export const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const user = await userModel.findById(id);
    if (!user?.confirmEmail) {
      return res.status(404).json({ message: "In-valid user" });
    }
    if (user.deleted) {
      return res.status(400).json({ message: "This account is deleted" });
    }
    const message = await messageModel.create({ text, reciverId: user._id });
    if (!message) {
      return res.status(400).json({ message: "Fail to add this message" });
    }
    return res.status(201).json({ message: "Done", message });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    if (user.deleted) {
      return res.status(400).json({ message: "You deleted your account" });
    }
    const message = await messageModel.findOneAndDelete({
      _id: id,
      reciverId: user._id,
    });
    if (!message) {
      return res.status(404).json({ message: "In-valid this message" });
    }
    return res.status(200).json({ message: "Done" });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const messages = async (req, res) => {
  try {
    const { user } = req;
    if (user.deleted) {
      return res.status(400).json({ message: "You deleted your account" });
    }
    const messages = await messageModel
      .find({ reciverId: user._id })
      .select("-reciverId");
    if (!messages.length) {
      return res.status(404).json({ message: "In-valid messages" });
    }
    return res.status(200).json({ message: "Done", messages });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    if (user.deleted) {
      return res.status(400).json({ message: "You deleted your account" });
    }
    const message = await messageModel
      .findOne({ _id: id, reciverId: user._id })
      .populate({
        path: "reciverId",
        select: "userName email phone age gender",
      });
    if (!message) {
      return res.status(404).json({ message: "In-valid message" });
    }
    return res.status(200).json({ message: "Done", message });
  } catch (err) {
    return res.status(500).json({ message: "Catch error", err });
  }
};
