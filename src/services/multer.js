import multer from "multer";

export const HME = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: "Multer error", err });
  } else {
    return next();
  }
};
export const multerValidation = {
  image: ["image/jpeg", "image/bng"],
  pdf: ["application/pdf", "text/html"],
};
export const myMulter = (customValidation) => {
  if (!customValidation) {
    customValidation = multerValidation.image;
  }
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("In-valid format", false);
    }
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};
