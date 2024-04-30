import authRouter from "./auth/auth.router.js";
import userRouter from "./user/user.router.js";
import messageRouter from "./message/message.router.js";
// import graphMessageSchema from "./message/GraphQl/GraphQlSchema.js";
// import graphUserSchema from "./user/GraphQl/GraphQlSchema.js";
import express from "express";
import cors from "cors";
import { globalError } from "../utils/errorHandling.js";
// import { createHandler } from "graphql-http/lib/use/express";
const appRouter = (app) => {
  app.use(cors());
  app.use(express.json());
  // app.use("/messageGraphQl", createHandler({ schema: graphMessageSchema }));
  // app.use("/userGraphQl", createHandler({ schema: graphUserSchema }));
  app.use(`/auth`, authRouter);
  app.use(`/user`, userRouter);
  app.use(`/message`, messageRouter);
  app.use(`/*`, (req, res, next) => {
    return next(new Error("In-valid url", { cause: 404 }));
  });
  app.use(globalError);
};
export default appRouter;
