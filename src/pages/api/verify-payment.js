import crypto from 'crypto';

export const prerender = false;

export async function POST({ request }) {
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const body = await request.json().catch(() => ({}));
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required payment verification parameters"
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!key_secret) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Server missing Razorpay Key Secret"
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment verified successfully",
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid payment signature. Signature mismatch."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error during verification"
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
