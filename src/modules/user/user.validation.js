import joi from "joi";
import { generalFields } from "../../middlewhere/validation.js";

export const forgetPassword = joi
  .object({
    code: joi.string().required().min(4).max(4).messages({
      "any.required": "code is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
    }),
    email: generalFields.email.messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter a real email",
    }),
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
  })
  .required();
export const updateUser = joi
  .object({
    userName: joi.string().min(2).max(10).messages({
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
    }),
    email: joi.string().email().messages({
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter a real email",
    }),
    authorization: generalFields.headers,
  })
  .required();
export const updatePassword = joi
  .object({
    oldPassword: generalFields.password,
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
    authorization: generalFields.headers,
  })
  .required();
export const sendCode = joi
  .object({
    email: joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter a real email",
    }),
  })
  .required();
export const headers = joi
  .object({
    authorization: generalFields.headers,
  })
  .required();
export const profilePic = joi
  .object({
    authorization: generalFields.headers,
    file: generalFields.file.required(),
  })
  .required();
export const user = joi
  .object({
    id: generalFields.id,
  })
  .required();
export const getUserById = joi
  .object({
    id: generalFields.id,
  })
  .required();
