import { Router } from "express";
import * as wishListController from "./controller/wishList.js";
import { auth } from "../../middlewhere/auth.js";
import validation from "../../middlewhere/validation.js";
import * as validators from "./wishList.validation.js";
const router = Router({ mergeParams: true });
router.patch(
  "/add",
  validation(validators.wishList),
  auth(),
  wishListController.add
);
router.patch(
  "/remove",
  validation(validators.wishList),
  auth(),
  wishListController.remove
);
export default router;
