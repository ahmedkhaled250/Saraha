import { Router } from "express";
import * as messageController from "./controller/message.js";
import { auth } from "../../middlewhere/auth.js";
import validation from "../../middlewhere/validation.js";
import * as validators from "./message.validation.js";
import wishListRouter from "../wishList/wishList.router.js"
const router = Router({ mergeParams: true });
router.use("/:id/wishList", wishListRouter);
router.post(
  "/unAuthonticated",
  validation(validators.addMessage),
  messageController.addMessage
);
router.post(
  "/Authonticated",
  validation(validators.addAuthMessage),
  auth(),
  messageController.addAuthMessage
);
router.delete(
  "/:id",
  validation(validators.deleteMessage),
  auth(),
  messageController.deleteMessage
);
router.get(
  "/receivedMessages",
  validation(validators.allMessages),
  auth(),
  messageController.receivedMessages
);
router.get(
  "/sentMessages",
  validation(validators.allMessages),
  auth(),
  messageController.sentMessages
);
export default router;
