import { Router } from "express";
import { auth } from "../../middlewhere/auth.js";
import { fileValidation, uploadPhoto } from "../../utils/uploadPhoto.js";
import * as userController from "./controller/user.js";
import messageRouter from "../message/message.router.js";
import validation from "../../middlewhere/validation.js";
import * as validators from "./user.validation.js";
const router = Router();
router.use("/:id/message", messageRouter);
router.patch(
  "/profilPic",
  uploadPhoto({ customValidation: fileValidation.image }).single("image"),
  validation(validators.profilePic),
  auth(),
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
router.patch(
  "/softdelete",
  validation(validators.headers),
  auth(),
  userController.softdelete
);
router.put(
  "/",
  validation(validators.updateUser),
  auth(),
  userController.updateUser
);
router.get(
  "/",
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
router.get(
  "/:id/sendMessage",
  validation(validators.getUserById),
  userController.redirectToSendMessage
);
router.get(
  "/:id",
  validation(validators.getUserById),
  userController.user
);

export default router;
