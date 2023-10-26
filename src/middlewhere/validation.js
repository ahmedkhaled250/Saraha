const methods = ["body", "params", "headers", "query"];
const validation = (schema) => {
  const validationErrors = [];
  return async (req, res, next) => {
    methods.forEach((key) => {
      const validationResult = schema.key.validate(req[key], {
        abortEarly: false,
      });
      if (validationResult?.error?.details)
        validationErrors.push(validationResult.error.details);
    });
    if (validationErrors.length) {
      return res
        .status(400)
        .json({ message: "Validation error", validationErrors });
    }
    return next();
  };
};
export default validation;
