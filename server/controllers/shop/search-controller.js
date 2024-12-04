import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Search Products by Keyword
export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    // Create the search query using Prisma
    const searchResults = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
              mode: "insensitive", // case-insensitive search
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            brand: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
