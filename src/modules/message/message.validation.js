import joi from "joi";
export const addMessage = {
  body: joi
    .object()
    .required()
    .keys({
      text: joi.string().min(5).max(200).required().messages({
        "any.required": "text is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
    }),
  params: joi
    .object()
    .required()
    .keys({
      id: joi.string().max(24).min(24).required().messages({
        "any.required": "id is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
    }),
};
export const deleteMessage = {
  params: joi
    .object()
    .required()
    .keys({
      id: joi.string().max(24).min(24).required().messages({
        "any.required": "id is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
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
export const messages = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
