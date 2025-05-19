// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cloudinary from 'cloudinary';

// Routers
import orderRouter from './routes/orderRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import paymentRouter from './routes/paymentRouter.js';

// Middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS config
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Built-in middleware
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Basic Routes
app.get('/', (req, res) => res.send('Hello World'));
app.get('/api/v1/test', (req, res) => res.json({ msg: 'test route' }));

// ✅ Protected Routes
app.use('/api/v1/orders', authenticateUser, orderRouter);

app.use('/api/v1/users', authenticateUser, userRouter);

// ✅ Public Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/v1/payments', paymentRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

// Error handler
app.use(errorHandlerMiddleware);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Start Server
const port = process.env.PORT || 5200;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server running on PORT ${port}...`);
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
