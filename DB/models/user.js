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
    gender: {
      type: String,
      enum: ["Male", "Female"]
    },
    image: { public_id: String, secure_url: String },
    code: Number,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    stopped: {
      type: Boolean,
      default: false,
    },
    changeTime: Date,
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
