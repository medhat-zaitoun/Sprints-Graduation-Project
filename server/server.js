import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from './routes/auth/auth-routes.js';
import adminProductsRouter from './routes/admin/products-routes.js';
import adminOrderRouter from './routes/admin/order-routes.js';
import shopProductsRouter from './routes/shop/products-routes.js';
import shopCartRouter from './routes/shop/cart-routes.js';
import shopAddressRouter from './routes/shop/address-routes.js';
import shopOrderRouter from './routes/shop/order-routes.js';
import shopSearchRouter from './routes/shop/search-routes.js';
import shopReviewRouter from './routes/shop/review-routes.js';
import commonFeatureRouter from './routes/common/feature-routes.js';
import { stripeWebhook } from './controllers/shop/order-controller.js';

const app = express();
const PORT = process.env.PORT || 5000;
// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://art-market-fbss.vercel.app', // Production
  'http://localhost:5173', // Another allowed domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      // If the origin is in the list of allowed origins or no origin (like in Postman requests), allow it
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },

    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma',
    ],
    credentials: false,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrderRouter);
app.use('/api/shop/products', shopProductsRouter);
app.use('/api/shop/cart', shopCartRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use('/api/shop/search', shopSearchRouter);
app.use('/api/shop/review', shopReviewRouter);
app.use('/api/common/feature', commonFeatureRouter);

//  Stripe webhook route
app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

const router = express.Router();

app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
