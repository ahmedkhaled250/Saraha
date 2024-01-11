import { massageType } from "./GraphQlTypes.js";
import { GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { GraphAuth } from "../../../middlewhere/auth.js";
import { graphQlValidation } from "../../../middlewhere/validation.js";
import { allMessages } from "../message.validation.js";
import { find } from "../../../../DB/dbmethods.js";
import messageModel from "../../../../DB/models/message.js";
import paginate from "../../../utils/paginate.js";
export const messagesResolver = {
  type: new GraphQLList(massageType),
  args: {
    authorization: { type: GraphQLString },
    page: { type: GraphQLInt },
    size: { type: GraphQLInt },
  },
  resolve: async (__, args) => {
    const isValid = graphQlValidation(allMessages, args);
    if (isValid.error) {
      throw new Error(isValid.error);
    }
    const { authorization, page, size } = args;
    const user = await GraphAuth(authorization);
    if (!user._id) {
      return user;
    }
    const { limit, skip } = paginate({ page, size });
    const messages = await find({
      model: messageModel,
      condition: { receiver: user._id },
      selec: "text date",
      skip,
      limit,
    });
    if (!messages.length) {
      throw new Error("In-valid messages", { cause: 404 });
    }
    return messages;
  },
};
