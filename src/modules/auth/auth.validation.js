import joi from "joi";
import { generalFields } from "../../middlewhere/validation.js";

export const signup = joi
  .object({
    userName: joi.string().required().min(2).max(20).messages({
      "any.required": "userName is required",
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
    gender:joi.string().allow("Male","Female"),
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
  })
  .required();
export const signin = joi
  .object({
    email: generalFields.email.messages({
      "any.required": "Email is required",
      "string.empty": "not allowed to be empty",
      "string.base": "only string is allowed",
      "string.email": "please enter realy email",
    }),
    password: generalFields.password
  })
  .required();
export const logout = joi
  .object({
    authorization:generalFields.headers,
  })
  .required();
export const token = joi
  .object({
    token: joi.string().required(),
  })
  .required();
