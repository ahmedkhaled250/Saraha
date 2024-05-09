import cloudinary  from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../config/.env") });
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_key,
  api_secret: process.env.cloud_secret,
  secure: true
});

export default cloudinary.v2;









// import cloudinary from 'cloudinary'
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: path.join(__dirname, "../../config/.env") });

// cloudinary.v2.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.cloud_key,
//   api_secret: process.env.cloud_secret,
//   secure: true
// });

// export default cloudinary.v2
