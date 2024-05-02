import { Router } from "express";
import {auth} from "../../middlewhere/auth.js";
import * as authController from "./controller/auth.js";
import * as validators from "./auth.validation.js";
import validation from "../../middlewhere/validation.js";
const router = Router();
router.post("/signup", validation(validators.signup), authController.signup);
router.get(
  "/confirmEmail/:token",
  validation(validators.token),
  authController.confirmEmail
);
router.get(
  "/refreshToken/:token",
  validation(validators.token),
  authController.refreshToken
);
router.post("/signin", validation(validators.signin), authController.signin);
router.patch(
  "/signout",
  validation(validators.logout),
  auth(),
  authController.signout
);
export default router;
