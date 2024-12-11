import express from 'express';
import { createOrder, verifyPayment, handleWebhook } from '../controllers/payment.controller.js';

const router = express.Router();


router.post('/create-order', createOrder);

router.post('/verify-payment', verifyPayment);

router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);



export default router;
