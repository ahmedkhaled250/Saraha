import joi from "joi";

export const forgetPassword = {
  body: joi
    .object()
    .required()
    .keys({
      code: joi.string().required().min(4).max(4).messages({
        "any.required": "code is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
        "string.email": "please enter a real email",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
    }),
};
export const updateUser = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(2).max(10).messages({
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      email: joi.string().email().messages({
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
        "string.email": "please enter a real email",
      }),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const updatePassword = {
  body: joi
    .object()
    .required()
    .keys({
      oldPassword: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        )
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const sendCode = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
        "string.email": "please enter a real email",
      }),
    }),
};
export const headers = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const user = {
  params: joi.object().required().keys({
    id: joi.string().required(),
  }),
};
