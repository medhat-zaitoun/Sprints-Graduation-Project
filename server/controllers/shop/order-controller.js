import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2022-11-15',
});
const prisma = new PrismaClient();

// Stripe Webhook for handling checkout completion
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      await createOrder(session);
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.status(200).json({ received: true });
};

// Create an order
export const createOrder = async (session) => {
  const { cartId, userId, addressId } = session.metadata;

  try {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    // Create the order in the database
    const newOrder = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        cartId: parseInt(cartId),
        addressId: parseInt(addressId),
        totalAmount: session.amount_total / 100,
        orderStatus: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        paymentId: session.payment_intent,
        payerId: session.customer,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
      },
    });

    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Capture payment after successful checkout
export const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    // Find the order by ID
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { cart: { include: { items: true } } },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Retrieve payment session
    const session = await stripe.checkout.sessions.retrieve(paymentId);
    if (session.payment_status === 'paid') {
      await prisma.order.update({
        where: { id: parseInt(order.id) },
        data: {
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
          paymentId,
        },
      });

      // Update product stock
      for (let item of order.cart.items) {
        let product = await prisma.product.findUnique({
          where: { id: parseInt(item.productId) },
        });

        if (!product || product.totalStock < item.quantity) {
          return res.status(404).json({
            success: false,
            message: `Not enough stock for product ${product ? product.title : 'N/A'}`,
          });
        }

        await prisma.product.update({
          where: { id: parseInt(product.id) },
          data: {
            totalStock: product.totalStock - item.quantity,
          },
        });
      }

      // Delete the cart after successful payment
      await prisma.cart.delete({ where: { id: order.cartId } });

      return res.status(200).json({ success: true, message: 'Order confirmed', data: order });
    } else {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error capturing payment:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during payment capture!',
    });
  }
};

// Get all orders by user
export const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: { cart: true },
    });

    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'No orders found!' });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ success: false, message: 'Some error occurred!' });
  }
};

// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { cart: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found!' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error retrieving order details:', error);
    res.status(500).json({ success: false, message: 'Some error occurred!' });
  }
};
