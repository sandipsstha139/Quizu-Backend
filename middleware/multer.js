import multer from "multer";
import path from "path";

const allowedExtensions = [".jpg", ".jpeg", ".png"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(extname)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only images with the following extensions are allowed: .jpg, .jpeg, .png"
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
