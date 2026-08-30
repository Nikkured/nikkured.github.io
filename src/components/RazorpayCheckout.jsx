import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle2, AlertCircle, Loader2, ShieldCheck, DollarSign } from 'lucide-react';

export const RazorpayCheckout = () => {
  const [amount, setAmount] = useState(500); // Default ₹500
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string, details?: any }
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const RAZORPAY_KEY_ID =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_RAZORPAY_KEY_ID) ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID) ||
    'rzp_test_TVtsyencqj0YUu';

  useEffect(() => {
    // Load Razorpay Checkout SDK Script if not already loaded
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setStatus({ type: 'error', message: 'Failed to load Razorpay SDK. Please check your network connection.' });
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handlePayment = async () => {
    setStatus(null);

    const amountInPaise = Math.round(Number(amount) * 100);

    if (isNaN(amountInPaise) || amountInPaise < 100) {
      setStatus({ type: 'error', message: 'Minimum payment amount is ₹1 (100 paise).' });
      return;
    }

    setLoading(true);

    try {
      // STEP 1: Call Backend to Create Order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        })
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || orderData.message || 'Failed to create payment order');
      }

      const { order_id, amount: orderAmount, currency } = orderData;

      // STEP 2: Configure & Open Razorpay Modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: currency || 'INR',
        name: 'Nikhil Vashisht Portfolio',
        description: 'Payment / Service Retainer',
        image: 'https://nikkured.github.io/favicon.ico',
        order_id: order_id,
        handler: async function (response) {
          // STEP 3: Verify Payment Signature on Backend
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setStatus({
                type: 'success',
                message: 'Payment verified and completed successfully!',
                details: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amountPaid: `₹${(orderAmount / 100).toFixed(2)}`
                }
              });
            } else {
              setStatus({
                type: 'error',
                message: verifyData.message || 'Payment verification failed. Signature mismatch.'
              });
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setStatus({
              type: 'error',
              message: 'Server error verifying payment signature.'
            });
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setStatus({ type: 'error', message: 'Payment window was closed before completion.' });
          }
        },
        prefill: {
          name: 'Nikhil Vashisht Client',
          email: 'client@example.com',
          contact: '+918882186438'
        },
        theme: {
          color: '#6366f1' // Indigo accent matching design system
        }
      };

      if (window.Razorpay) {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function (response) {
          console.error('Razorpay payment failed:', response.error);
          setStatus({
            type: 'error',
            message: `Payment failed: ${response.error.description || response.error.reason || 'Transaction declined'}`
          });
          setLoading(false);
        });
        razorpayInstance.open();
      } else {
        throw new Error('Razorpay SDK not available. Reload the page and try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setStatus({
        type: 'error',
        message: err.message || 'An error occurred initializing checkout.'
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Razorpay Standard Checkout</h3>
          <p className="text-xs font-mono text-slate-400">Secure 256-Bit Encrypted Payment Gateway</p>
        </div>
      </div>

      {/* Preset Amount Buttons */}
      <div className="mb-6">
        <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
          Select Amount (INR)
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[100, 500, 1000, 2500].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${
                amount === preset
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800/80 text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              ₹{preset}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">₹</span>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Custom amount in INR"
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pay ₹{amount || 0} with Razorpay</span>
          </>
        )}
      </motion.button>

      {/* Feedback Messages */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-4 rounded-xl text-xs font-mono border ${
              status.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {status.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold mb-1">{status.message}</p>
                {status.details && (
                  <div className="space-y-0.5 text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/10">
                    <div>Payment ID: <span className="text-white">{status.details.paymentId}</span></div>
                    <div>Order ID: <span className="text-white">{status.details.orderId}</span></div>
                    <div>Amount Paid: <span className="text-white">{status.details.amountPaid}</span></div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
