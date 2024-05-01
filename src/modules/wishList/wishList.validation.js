import joi from "joi";
import { generalFields } from "../../middlewhere/validation.js";
export const wishList = joi
  .object({
    id: generalFields.id,
    authorization: generalFields.headers,
  })
  .required();