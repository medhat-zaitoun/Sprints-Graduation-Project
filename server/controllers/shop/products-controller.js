import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get Filtered Products
export const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = {
        in: category.split(","),
      };
    }

    if (brand.length) {
      filters.brand = {
        in: brand.split(","),
      };
    }

    let orderBy = {};

    switch (sortBy) {
      case "price-lowtohigh":
        orderBy.price = "asc";
        break;
      case "price-hightolow":
        orderBy.price = "desc";
        break;
      case "title-atoz":
        orderBy.title = "asc";
        break;
      case "title-ztoa":
        orderBy.title = "desc";
        break;
      default:
        orderBy.price = "asc";
        break;
    }

    const products = await prisma.product.findMany({
      where: filters,
      orderBy,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Get Product Details
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};
