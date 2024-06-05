import { model, Schema, Types } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
    },
    linkName: {
      type: String,
      required: [true, "linkName is required"],
      unique: [true, "linkName must be unique value"],
    },
    userLink: {
      type: String,
      unique: [true, "linkName must be unique value"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
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
    wishList: {
      type: [Types.ObjectId],
      ref: "Message",
    }
  },
  {
    timestamps: true,
  }
);
const userModel = model("User", userSchema);
export default userModel;
