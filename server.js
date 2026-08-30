import express from 'express';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.warn("⚠️ WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing in environment variables.");
}

const razorpay = new Razorpay({
  key_id: key_id || '',
  key_secret: key_secret || ''
});

// Serve static frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

/**
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order
 * Request: { amount (paise), currency, receipt }
 * Return: { order_id, amount, currency }
 */
app.post('/api/create-order', async (req, res) => {
  try {
    if (!key_id || !key_secret) {
      return res.status(401).json({
        error: "Razorpay API credentials missing on server. Check .env configuration."
      });
    }

    const { amount = 50000, currency = 'INR', receipt } = req.body;
    const numericAmount = Number(amount);

    // Minimum amount check: 100 paise (1 INR)
    if (isNaN(numericAmount) || numericAmount < 100) {
      return res.status(400).json({
        error: "Amount must be at least 100 paise (1 INR)"
      });
    }

    const options = {
      amount: numericAmount,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    
    if (error.statusCode === 401 || (error.error && error.error.code === 'BAD_REQUEST_ERROR' && error.error.description.includes('Authentication'))) {
      return res.status(401).json({ error: "Razorpay authentication failed. Invalid Key ID or Key Secret." });
    }
    
    return res.status(500).json({
      error: error.message || "Failed to create order with Razorpay API"
    });
  }
});

/**
 * STEP 3: BACKEND - Verify Payment Signature
 * Endpoint: POST /api/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 */
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Validate required payload fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification parameters (razorpay_payment_id, razorpay_order_id, razorpay_signature)"
      });
    }

    if (!key_secret) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error: Key Secret not configured"
      });
    }

    // Generate HMAC-SHA256 signature
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    // Compare generated signature with received signature
    if (generated_signature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
    } else {
      // Signature mismatch: return 400, do NOT mark as paid
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Signature mismatch."
      });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment signature:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during verification"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Razorpay Server listening on http://localhost:${PORT}`);
});
