import authRouter from "./auth/auth.router.js";
import userRouter from "./user/user.router.js";
import messageRouter from "./message/message.router.js";
import express from "express";
import { globalError } from "../services/errorHandling.js";
const appRouter = (app) => {
  const baseUrl = process.env.BASEURL;
  app.use(express.urlencoded({extended:false}));
  app.use(express.json());
  app.use(`${baseUrl}/auth`, authRouter);
  app.use(`${baseUrl}/user`, userRouter);
  app.use(`${baseUrl}/message`, messageRouter);
  app.use(globalError)
};
export default appRouter