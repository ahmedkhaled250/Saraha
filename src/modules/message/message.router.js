import { Router } from "express";
import * as messageController from "./controller/message.js";
import auth from "../../middlewhere/auth.js";
import validation from "../../middlewhere/validation.js";
import * as validators from "./message.validation.js";
const router = Router({ mergeParams: true });
router.post(
  "/",
  validation(validators.addMessage),
  messageController.addMessage
);
router.delete(
  "/:id",
  validation(validators.deleteMessage),
  auth(),
  messageController.deleteMessage
);
router.get(
  "/",
  validation(validators.messages),
  auth(),
  messageController.messages
);
export default router;
