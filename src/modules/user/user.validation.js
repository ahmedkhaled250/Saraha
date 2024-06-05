import joi from "joi";
import { generalFields } from "../../middlewhere/validation.js";

export const forgetPassword = joi
  .object({
    code: joi.number().required().min(1000).max(9999).messages({
      "any.required": "code is required",
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
    userName: joi.string().min(2).max(20).messages({
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
    }),
    linkName: joi.string().min(2).max(20).messages({
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
    }),
    email: joi.string().email().messages({
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter a real email",
    }),
    gender: joi.string().allow("Male", "Female"),
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
export const getUserByUserName = joi
  .object({
    userName: joi.string().required().min(2).max(20).messages({
      "any.required": "linkName is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
    }),
  })
  .required();
