import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { orderService } from '@/services/orderService'
import Button from '@/components/common/Button'
import ShippingForm from '@/components/checkout/ShippingForm'
import PaymentForm from '@/components/checkout/PaymentForm'
import OrderReview from '@/components/checkout/OrderReview'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import './CheckoutPage.css'

const CHECKOUT_STEPS = [
  { id: 1, label: 'Shipping' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Review' },
]

const normalizeShippingData = (data = {}) => ({
  fullName: String(data?.fullName || data?.name || '').trim(),
  email: String(data?.email || '').trim(),
  phone: String(data?.phone || '').trim(),
  street: String(data?.street || '').trim(),
  city: String(data?.city || '').trim(),
  country: String(data?.country || '').trim(),
  zip: String(data?.zip || data?.postalCode || '').trim(),
  notes: String(data?.notes || '').trim(),
})

export default function CheckoutPage() {
  const { cart, totalPrice, dispatch } = useCart()

  const [step, setStep] = useState(1)
  const [shippingData, setShippingData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const safeCart = Array.isArray(cart) ? cart : []
  const safeTotalPrice = Number.isFinite(Number(totalPrice)) ? Number(totalPrice) : 0
  const isCartEmpty = safeCart.length === 0

  const handleShippingSubmit = (data) => {
    setShippingData(normalizeShippingData(data))
    setStep(2)
  }

  const handlePaymentSubmit = (data) => {
    const rawCardNumber = String(data?.cardNumber || '')
    const digits = rawCardNumber.replace(/\D/g, '')

    setPaymentData({
      ...data,
      method: data?.paymentMethod || 'Credit Card',
      brand: 'Card',
      last4: digits.slice(-4),
    })
    setStep(3)
  }

  const handlePlaceOrder = async () => {
    if (isCartEmpty) return

    setIsProcessing(true)
    setError(null)

    try {
      const normalizedShippingData = normalizeShippingData(shippingData || {})

      const orderPayload = {
        items: safeCart,
        shippingAddress: normalizedShippingData,
        payment: paymentData,
        paymentMethod: paymentData?.method || paymentData?.paymentMethod || 'Credit Card',
        totalPrice: safeTotalPrice,
        // Transitional fields for compatibility with legacy mock payload readers.
        shipping: normalizedShippingData,
        totalAmount: safeTotalPrice,
      }

      await orderService.create(orderPayload)
      dispatch({ type: 'CLEAR' })
      setIsSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="checkout-success">
        <h1 className="checkout-success__title">Order Confirmed</h1>
        <p className="checkout-success__message">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Button to="/shop" variant="primary" className="checkout-success__action">
          Return to Shop
        </Button>
      </main>
    )
  }

  if (isCartEmpty) {
    return (
      <main className="checkout-empty">
        <h1 className="checkout-empty__title">Your Cart Is Empty</h1>
        <p className="checkout-empty__message">
          You need items in your cart to proceed with checkout.
        </p>
        <Button to="/shop" variant="primary" className="checkout-empty__action">
          Browse Collection
        </Button>
      </main>
    )
  }

  const reviewCartData = {
    items: safeCart,
    subtotal: safeTotalPrice,
    tax: 0,
    shippingCost: 0,
    total: safeTotalPrice,
  }

  return (
    <main className="checkout-page">
      <CheckoutSteps currentStep={step} steps={CHECKOUT_STEPS} onStepChange={setStep} />

      {error && <div className="checkout-page__error">{error}</div>}

      <div className="checkout-page__content">
        {step === 1 && (
          <ShippingForm
            initialData={shippingData || undefined}
            onSubmit={handleShippingSubmit}
            isProcessing={isProcessing}
          />
        )}

        {step === 2 && (
          <PaymentForm
            initialData={paymentData || undefined}
            onSubmit={handlePaymentSubmit}
            onBack={() => setStep(1)}
            isProcessing={isProcessing}
          />
        )}

        {step === 3 && (
          <OrderReview
            cart={reviewCartData}
            shippingData={shippingData}
            paymentData={paymentData}
            onEditShipping={() => setStep(1)}
            onEditPayment={() => setStep(2)}
            onBack={() => setStep(2)}
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </main>
  )
}

