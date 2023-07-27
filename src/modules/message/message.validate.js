import joi from "joi";

export const token = {
  headers: joi.object().required().keys({
    authorization: joi.string().required(),
  }),
};
export const addMessage = {
  params: joi.object().required().keys({
    id: joi.string().required(),
  }),
  body: joi.object().required().keys({
    text: joi.string().required(),
  }),
};
export const idAndToken = {
  params: joi.object().required().keys({
    id: joi.string().required(),
  }),
  headers: joi.object().required().keys({
    authorization: joi.string().required(),
  }),
};
