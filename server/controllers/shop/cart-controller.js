import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    console.log(product)

    let cart = await prisma.cart.findFirst({
      where: { userId: parseInt(userId) },
      include: { items: true }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    // const findCurrentProductIndex = cart.items.findIndex(
    //   (item) => item.productId == parseInt(productId)
    // );
    const findCurrentProductIndex = Array.isArray(cart.items)
      ? cart.items.findIndex((item) => item.productId == parseInt(productId))
      : -1;

    if (findCurrentProductIndex === -1) {
      await prisma.cartItem.create({
        data: { cartId: parseInt(cart.id), productId: parseInt(productId), quantity }
      });
    } else {
      await prisma.cartItem.updateMany({
        where: {
          cartId: parseInt(cart.id),
          productId: parseInt(productId)
        },
        data: { quantity: cart.items[findCurrentProductIndex].quantity + quantity }
      });
    }

    const updatedCart = await prisma.cart.findFirst({
      where: { id: parseInt(cart.id) },
      include: { items: true }
    });

    res.status(200).json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// Fetch Cart Items
export const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: parseInt(userId) },
      include: { items: { include: { product: true } } }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter((item) => item.product);

    res.status(200).json({
      success: true,
      data: {
        ...cart,
        items: validItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// Update Cart Item Quantity
export const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: parseInt(userId) },
      include: { items: { include: { product: true } } }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId == parseInt(productId)
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    await prisma.cartItem.updateMany({
      where: {
        cartId: parseInt(cart.id),
        productId: parseInt(productId)
      },
      data: { quantity }
    });

    const updatedCart = await prisma.cart.findFirst({
      where: { id: parseInt(cart.id) },
      include: { items: { include: { product: true } } }
    });

    res.status(200).json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// Delete Cart Item
export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: parseInt(userId) },
      include: { items: true }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: parseInt(cart.id),
        productId: parseInt(productId)
      }
    });

    const updatedCart = await prisma.cart.findFirst({
      where: { id: parseInt(cart.id) },
      include: { items: true }
    });

    res.status(200).json({
      success: true,
      data: updatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
