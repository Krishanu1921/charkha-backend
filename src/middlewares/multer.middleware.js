import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
});

const upload = multer({ storage: storage });

export {upload};