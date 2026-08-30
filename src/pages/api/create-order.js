import Razorpay from 'razorpay';

export const prerender = false;

export async function POST({ request }) {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return new Response(
      JSON.stringify({ error: "Razorpay API credentials missing on server" }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { amount = 50000, currency = 'INR', receipt } = body;
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount < 100) {
      return new Response(
        JSON.stringify({ error: "Amount must be at least 100 paise (1 INR)" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: numericAmount,
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`
    });

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create order" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
