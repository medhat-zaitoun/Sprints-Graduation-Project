import express from "express";
import {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} from "../../controllers/admin/products-controller.js";
import { upload ,cloudinary } from "../../helpers/cloudinary.js";
// import { upload } from "../../helpers/cloudinary.js";

const router = express.Router();

// const cloudinary = require("../utils/cloudinary");
// const upload = require("../middleware/multer");

 router.post('/upload-image', upload.single('image'), function (req, res) {
  cloudinary.uploader.upload(req.file.path, function (err, result){
    console.log(result)
    if(err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      })
    }

    res.status(200).json({
      success: true,
      message:"Uploaded!",
      data: result
    })
  })
});

// router.post("/upload-image",upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

export default router;
