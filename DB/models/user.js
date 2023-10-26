import { model, Schema } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    image:String,
    imageId:String,
    code:Number,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = model("User", userSchema);
export default userModel;
