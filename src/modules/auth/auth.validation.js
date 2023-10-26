import joi from "joi";

export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().required().min(2).max(20).messages({
        "any.required": "userName is required",
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
export const signin = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
        "string.email": "please enter realy email",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        )
        .required(),
    }),
};
export const logout = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const token = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
