import multer from "multer";
export const fileValidation = {
  image: ["image/png", "image/jpg", "image/jpeg"],
};
export const uploadPhoto = ({
  customValidation = fileValidation.image,
} = {}) => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (!customValidation.includes(file.mimetype)) {
      cb("In-valid format", false);
    }
    cb(null, true);
  };
  const upload = multer({ fileFilter });
  return upload;
};
