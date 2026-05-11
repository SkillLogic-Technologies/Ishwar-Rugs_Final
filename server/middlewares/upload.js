import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";
    if (req.baseUrl.includes("category")) {
      folder = path.join(__dirname, "../uploads/category");
    } else if (req.baseUrl.includes("product")) {
      folder = path.join(__dirname, "../uploads/product");
    } else if (req.baseUrl.includes("collection")) {
      folder = path.join(__dirname, "../uploads/collection");
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });