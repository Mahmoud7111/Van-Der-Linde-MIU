import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderReview from '@/components/checkout/OrderReview';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
export default function CheckoutPage() {
  const { cart, totalPrice, dispatch } = useCart();

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setStep(2);
  };
  const handlePaymentSubmit = (data) => {
    setPaymentData(data);
    setStep(3);
  };
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const orderPayload = {
        items: cart,
        shipping: shippingData,
        payment: paymentData,
        totalAmount: totalPrice,
      };

      await orderService.create(orderPayload);
      dispatch({ type: 'CLEAR' });
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  if (isSuccess) {
    return (
      <main className="checkout-page" style={{ padding: 'var(--space-2xl) var(--space-md)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>Order Confirmed</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-xl)' }}>
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Link
          to="/shop"
          style={{
            display: 'inline-block',
            padding: 'var(--space-sm) var(--space-lg)',
            background: 'var(--color-gold)',
            color: '#151515',
            borderRadius: 'var(--radius-full)',
            fontWeight: '500'
          }}
        >
          Return to Shop
        </Link>
      </main>
    );
  }
  if (cart.length === 0) {
    return (
      <main className="checkout-page" style={{ padding: 'var(--space-2xl) var(--space-md)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>Your Cart is Empty</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-xl)' }}>
          You need items in your cart to proceed with checkout.
        </p>
        <Link
          to="/shop"
          style={{
            display: 'inline-block',
            padding: 'var(--space-sm) var(--space-lg)',
            background: 'var(--color-gold)',
            color: '#151515',
            borderRadius: 'var(--radius-full)',
            fontWeight: '500'
          }}
        >
          Browse Collection
        </Link>
      </main>
    );
  }
  const reviewCartData = {
    items: cart,
    subtotal: totalPrice,
    tax: 0,
    shippingCost: 0,
    total: totalPrice,
  };
  return (
    <main className="checkout-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--space-xl) var(--space-md)' }}>
      <CheckoutSteps currentStep={step} />

      {error && (
        <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-lg)', textAlign: 'center', padding: 'var(--space-sm)', background: 'color-mix(in srgb, var(--color-error) 10%, transparent)' }}>
          {error}
        </div>
      )}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        {step === 1 && (
          <ShippingForm
            initialData={shippingData || undefined}
            onSubmit={handleShippingSubmit}
          />
        )}

        {step === 2 && (
          <PaymentForm
            initialData={paymentData || undefined}
            onSubmit={handlePaymentSubmit}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <OrderReview
            cart={reviewCartData}
            shippingData={shippingData}
            paymentData={paymentData}
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </main>
  );
}

