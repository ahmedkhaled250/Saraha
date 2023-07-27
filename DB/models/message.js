import { Schema, model, Types } from "mongoose";
const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    reciverId: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const messageModel = model("Message", messageSchema);
export default messageModel;
