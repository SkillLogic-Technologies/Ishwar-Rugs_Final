import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";
    if (req.baseUrl.includes("category")) {
      folder = "uploads/category/";
    } else if (req.baseUrl.includes("product")) {
        folder = "uploads/product/";
    } else if (req.baseUrl.includes("collection")) {
        folder = "uploads/collection/";
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });