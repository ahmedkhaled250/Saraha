import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  getUserByIdResolver,
  profileResolver,
} from "./GraphQlResolvers.js";
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "mainQueryMessageSchema",
    description: "main query",
    fields: {
      profile: profileResolver,
      getUserById: getUserByIdResolver,
    },
  }),
});
export default schema;
