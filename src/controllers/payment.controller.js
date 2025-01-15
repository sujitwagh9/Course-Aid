import Razorpay from 'razorpay';
import crypto from 'crypto';
import 'dotenv/config'


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res, next) => {
  const { amount, currency, receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa (INR)
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(new ApiError(500, 'Failed to create payment order', error));
  }
};


export const verifyPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      return next(new ApiError(400, 'Invalid payment signature'));
    }
  } catch (error) {
    next(new ApiError(500, 'Failed to verify payment', error));
  }
};


export const handleWebhook = (req, res, next) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers['x-razorpay-signature'];
  
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');
  
    if (receivedSignature === expectedSignature) {
      console.log('Webhook verified:', req.body);
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }
  };
  