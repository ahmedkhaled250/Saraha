import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import appRouter from "./src/modules/app.js";
import connectDB from "./DB/connection.js";
const __direname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__direname, "./config/.env") });
const port = process.env.PORT || 5000;
const app = express();
appRouter(app);
connectDB();
app.listen(port, () => console.log(`Running...............${port}`));

// const app = express()

// app.use
// app.post
// app.put
// app.patch
// app.delete
// app.get

// app.listen(5000, () => console.log("Running...............5000"))