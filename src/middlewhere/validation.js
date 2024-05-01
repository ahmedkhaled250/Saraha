const methods = ["body", "params", "headers", "query"];
import joi from "joi";
import { Types } from "mongoose";
export const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};
export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  cPassword: joi.string().required(),
  id: joi.string().custom(validateObjectId).required(),
  optionalId: joi.string().custom(validateObjectId),

  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
  headers: joi.string().required(),
};
export const validateQuery = {
  page: joi.number(),
  size: joi.number(),
  sort: joi.string(),
};
const validation = (schema) => {
  return async (req, res, next) => {
    const dataInputs = {
      ...req.body,
      ...req.params,
      ...req.query,
    };
    if (req.headers.authorization) {
      dataInputs.authorization = req.headers.authorization;
    }
    if (req.file || req.files) {
      dataInputs.file = req.file || req.files;
    }
    const validationResult = schema.validate(dataInputs, {
      abortEarly: false,
    });
    if (validationResult.error?.details) {
      return res.status(400).json({
        message: "Validation error",
        error: validationResult.error.details,
      });
    }
    return next();
  };
};
export const graphQlValidation = (schema, args) => {
  const validationResult = schema.validate(args, {
    abortEarly: false,
  });
  if (validationResult.error?.details) {
    return { error: validationResult.error };
  }
  return true;
};
export default validation;
