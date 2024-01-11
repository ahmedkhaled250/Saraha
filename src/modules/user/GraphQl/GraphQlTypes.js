import { GraphQLObjectType, GraphQLString } from "graphql";

export const imageType = new GraphQLObjectType({
    name: "imageType",
    fields: {
      public_id: { type: GraphQLString },
      secure_url: { type: GraphQLString },
    },
  });
export  const userType = new GraphQLObjectType({
    name: "userType",
    fields: {
      userName: { type: GraphQLString },
      email: { type: GraphQLString },
      _id: { type: GraphQLString },
      image: {
        type: imageType,
      },
    },
  });