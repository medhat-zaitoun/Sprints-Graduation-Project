import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add Feature Image
export const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    console.log(image, "image");

    const featureImage = await prisma.feature.create({
      data: {
        image,
      },
    });

    res.status(201).json({
      success: true,
      data: featureImage,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Get Feature Images
export const getFeatureImages = async (req, res) => {
  try {
    const images = await prisma.feature.findMany();

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};
