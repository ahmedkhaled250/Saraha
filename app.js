import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/connection.js";
import * as indexRouter from "./src/modules/index.router.js";
dotenv.config();
const app = express();
const baseUrl = process.env.BASEURL;
const port = process.env.PORT;
app.use(express.json());
app.use(`${baseUrl}/auth`, indexRouter.authRouter);
app.use(`${baseUrl}/user`, indexRouter.userRouter);
app.use(`${baseUrl}/message`, indexRouter.messageRouter);
app.use(`*`, (req, res) => {
  return res.status(404).json({ message: "In-valid routing" });
});
connectDB();
app.listen(port, () => console.log(`Running.............${port}`));
