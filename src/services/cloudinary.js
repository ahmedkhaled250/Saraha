import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
const __direname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__direname, "../../config/.env") });
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_key,
  api_secret: process.env.cloud_secret,
});
export default cloudinary;
