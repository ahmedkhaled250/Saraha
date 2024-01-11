import { userType } from "./GraphQlTypes.js";
import userModel from "../../../../DB/models/user.js";
import { GraphQLString } from "graphql";
import { GraphAuth } from "../../../middlewhere/auth.js";
import { findById } from "../../../../DB/dbmethods.js";
import { graphQlValidation } from "../../../middlewhere/validation.js";
import { headers, getUserById } from "../user.validation.js";
export const profileResolver = {
  type: userType,
  args: {
    authorization: { type: GraphQLString },
  },
  resolve: async (__, args) => {
    const isValid = graphQlValidation(headers, args);
    if (isValid.error) {
      throw new Error(isValid.error);
    }
    const { authorization } = args;
    const user = await GraphAuth(authorization);
    return user;
  },
};
export const getUserByIdResolver = {
  type: userType,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (__, args) => {
    const { id } = args;
    const isValid = graphQlValidation(getUserById, args);
    if (isValid.error) {
      console.log("fffffff");
      throw new Error(isValid.error);
    }

    const user = await findById({
      model: userModel,
      condition: id,
      select: "userName email image",
    });
    if (!user) {
      throw new Error("In-valid user");
    }
    return user;
  },
};
