import { Router } from "express";
import * as userController from "./controller/user.js";
import * as validate from "./user.validate.js";
import auth from "../../middlewear/auth.js";
import validation from "../../middlewear/validate.js";
import { HME, multerValidation, myMulter } from "../../services/multer.js";
const router = Router();

router.patch(
  "/profilePic",
  validation(validate.token),
  auth(),
  myMulter(multerValidation.image).single("image"),
  HME,
  userController.profilePic
);

router.get(
  "/sharelinkprofile/:id",
  validation(validate.sharelinkprofile),
  userController.sharelinkprofile
);
router.get(
  "/shareprofile",
  validation(validate.token),
  auth(),
  userController.shareprofile
);
router.put(
  "/updateProfile",
  validation(validate.updateProfile),
  auth(),
  userController.updateProfile
);
router.patch(
  "/updatePassword",
  validation(validate.updatePassword),
  auth(),
  userController.updatePassword
);
router.delete(
  "/deleteProfile",
  validation(validate.token),
  auth(),
  userController.deleteProfile
);
router.patch(
  "/softDeleteProfile",
  validation(validate.token),
  auth(),
  userController.softDeleteProfile
);
router.get(
  "/profile",
  validation(validate.token),
  auth(),
  userController.getUserById
);
router.patch(
  "/sendCode",
  validation(validate.sendCode),
  userController.sendCode
);
router.patch(
  "/forgetPassword",
  validation(validate.forgetPssword),
  userController.forgetPassword
);
router.get("/", userController.users);
export default router;
