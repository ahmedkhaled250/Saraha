import { Router } from "express";
import auth from "../../middlewhere/auth.js";
import { fileValidation, uploadPhoto } from "../../services/uploadPhoto.js";
import * as userController from "./controller/user.js";
import messageRouter from "../message/message.router.js";
import validation from "../../middlewhere/validation.js";
import * as validators from "./user.validation.js";
const router = Router();
router.use("/:id/message", messageRouter);
router.patch(
  "/profilPic",
  validation(validators.headers),
  auth(),
  uploadPhoto({ customValidation: fileValidation.image }).single("image"),
  userController.profilePic
);
router.patch(
  "/deleteProfilePic",
  validation(validators.headers),
  auth(),
  userController.deleteProfilePic
);
router.patch(
  "/updatePassword",
  validation(validators.updatePassword),
  auth(),
  userController.updatePassword
);
router.patch(
  "/sendCode",
  validation(validators.sendCode),
  userController.sendCode
);
router.patch(
  "/forgetPassword",
  validation(validators.forgetPassword),
  userController.forgetPassword
);
router.put(
  "/",
  validation(validators.updateUser),
  auth(),
  userController.updateUser
);
router.get("/:id", validation(validators.user), userController.user);
router.get(
  "/profile",
  validation(validators.headers),
  auth(),
  userController.profile
);
router.get(
  "/profileLink",
  validation(validators.headers),
  auth(),
  userController.profileLink
);
export default router;
