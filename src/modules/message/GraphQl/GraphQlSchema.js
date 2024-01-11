import {
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";
import {} from "graphql";
import { messagesResolver } from "./GraphQlResolvers.js";
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "mainQueryMessageSchema",
    description: "main query",
    fields: {
      messages:messagesResolver
    },
  }),
});
export default schema;
