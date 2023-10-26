import { model, Schema, Types} from "mongoose";
const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Text is required"],
    },
    date: Date,
    receiver:{
      type:Types.ObjectId,
      ref:"User"
    },
  },
  {
    timestamps: true,
  }
);
const messageModel = model("Message", messageSchema);
export default messageModel;
