import { handleUpload } from "../../helpers/cloudinary.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// import { v2 as cloudinary } from 'cloudinary';

// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables from .env file

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: "dyhpfkyub",
//   api_key: "364358192441167",
//   api_secret: "MJ48TKzU6B-Yj07x3VOCOstHWZw",
// });

export const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    res.json(cldRes);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
    });
  }
};

// async function processImages(req) {
//   try {
//     const imageUrls = await uploadToCloudinary(req);
//     console.log('Uploaded Image URLs:', imageUrls);
//     return imageUrls;
//   } catch (error) {
//     console.error('Error uploading images:', error);
//     throw error;
//   }
// }


// export const handleImageUpload = async (req, res) => {
//   try {
//     const result = await processImages(req); // Assuming 'url' is in the request body
//     res.json({
//       success: true,
//       result,
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: "Error occurred",
//     });
//   }
// };



// Add a new product
export const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;
    
    const newlyCreatedProduct = await prisma.product.create({
      data: {
        image,
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        totalStock,
        averageReview,
      },
    });

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Fetch all products
export const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await prisma.product.findMany();
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Edit a product
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const findProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title: title || findProduct.title,
        description: description || findProduct.description,
        category: category || findProduct.category,
        brand: brand || findProduct.brand,
        price: price !== undefined ? price : findProduct.price,
        salePrice: salePrice !== undefined ? salePrice : findProduct.salePrice,
        totalStock: totalStock || findProduct.totalStock,
        image: image || findProduct.image,
        averageReview: averageReview || findProduct.averageReview,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};
