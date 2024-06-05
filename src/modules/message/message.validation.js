import joi from "joi";
import { generalFields, validateQuery } from "../../middlewhere/validation.js";
export const addMessage = joi
  .object({
    text: joi.string().min(5).max(500).required().messages({
      "any.required": "text is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
    }),
    id: generalFields.id,
  })
  .required();
export const addAuthMessage = joi
  .object({
    text: joi.string().min(5).max(200).required().messages({
      "any.required": "text is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
    }),
    id: generalFields.id,
    authorization: generalFields.headers,
  })
  .required();
export const deleteMessage = joi
  .object({
    id: generalFields.id,
    authorization: generalFields.headers,
  })
  .required();
export const allMessages = joi
  .object({
    ...validateQuery,
    authorization: generalFields.headers,
  })
  .required();
