import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add Product Review
export const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Check if the user has ordered the product
    const order = await prisma.order.findFirst({
      where: {
        userId: parseInt(userId)
        // cartItems: {
        //   where: { productId: parseInt(productId) }
        // },
      },
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase the product to review it.",
      });
    }

    // Check if the user already reviewed the product
    const existingReview = await prisma.productReview.findFirst({
      where: {
        productId: parseInt(productId),
        userId: parseInt(userId),
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    // Create a new review
    const newReview = await prisma.productReview.create({
      data: {
        productId: parseInt(productId),
        userId: parseInt(userId),
        userName,
        reviewMessage,
        reviewValue,
      },
    });

    // Calculate the average review
    const reviews = await prisma.productReview.findMany({
      where: { productId: parseInt(productId) },
    });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    // Update the product's average review
    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { averageReview },
    });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// Get Product Reviews
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.productReview.findMany({
      where: { productId: parseInt(productId) },
    });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
