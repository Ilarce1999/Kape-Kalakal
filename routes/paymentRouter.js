import express from 'express';
import { createPaypalOrder, GetClientId } from '../src/controllers/paymentController.js';
const router = express.Router();

router.post('/create-paypal-order', createPaypalOrder);
router.get('/', GetClientId);

export default router;
