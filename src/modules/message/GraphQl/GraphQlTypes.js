import { GraphQLObjectType, GraphQLString } from "graphql";

export const massageType = new GraphQLObjectType({
  name: "messageType",
  fields: {
    text: { type: GraphQLString },
    date: { type: GraphQLString },
    _id: { type: GraphQLString },
  },
});
