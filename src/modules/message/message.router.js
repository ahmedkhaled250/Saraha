import { Router } from "express";
import * as messageController from "./controller/message.js";
import * as validate from "./message.validate.js";
import auth from "../../middlewear/auth.js";
import validation from "../../middlewear/validate.js";
const router = Router({ mergeParams: true });
router.post("/", validation(validate.addMessage), messageController.addMessage);
router.delete(
  "/:id",
  validation(validate.idAndToken),
  auth(),
  messageController.deleteMessage
);
router.get("/", validation(validate.token), auth(), messageController.messages);
router.get(
  "/:id",
  validation(validate.idAndToken),
  auth(),
  messageController.getMessageById
);
export default router;
