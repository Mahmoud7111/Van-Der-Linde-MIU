import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { orderService } from '@/services/orderService'
import toast from 'react-hot-toast'
import Button from '@/components/common/Button'
import ShippingForm from '@/components/checkout/ShippingForm'
import PaymentForm from '@/components/checkout/PaymentForm'
import OrderReview from '@/components/checkout/OrderReview'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import './CheckoutPage.css'

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

const hasShippingData = (data) => {
  const normalized = normalizeShippingData(data)
  return ['fullName', 'email', 'phone', 'street', 'city', 'country', 'zip']
    .every((key) => normalized[key])
}

const hasPaymentData = (data) => {
  if (!data?.method && !data?.paymentMethod) return false
  if ((data.method || data.paymentMethod) === 'Cash on Delivery') return true
  return Boolean(data.cardName && data.cardNumber && data.expiry && data.cvv)
}

export default function CheckoutPage() {
  const { cart, totalPrice, dispatch } = useCart()
  const { t } = useLanguage()

  const [step, setStep] = useState(1)
  const [shippingData, setShippingData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const safeCart = Array.isArray(cart) ? cart : []
  const safeTotalPrice = Number.isFinite(Number(totalPrice)) ? Number(totalPrice) : 0
  const isCartEmpty = safeCart.length === 0

  const handleShippingSubmit = (data) => {
    setShippingData(normalizeShippingData(data))
    setStep(2)
  }

  const handlePaymentSubmit = (data) => {
    const isCOD = data?.paymentMethod === 'Cash on Delivery'
    const rawCardNumber = String(data?.cardNumber || '')
    const digits = rawCardNumber.replace(/\D/g, '')

    setPaymentData({
      ...data,
      method: data?.paymentMethod || 'Credit Card',
      brand: isCOD ? 'Cash' : 'Card',
      last4: isCOD ? null : digits.slice(-4),
    })
    setStep(3)
  }

  const handlePlaceOrder = async () => {
    if (isCartEmpty) return

    if (!hasShippingData(shippingData)) {
      toast.error('Please complete valid shipping details first.')
      setStep(1)
      return
    }

    if (!hasPaymentData(paymentData)) {
      toast.error('Please complete valid payment details first.')
      setStep(2)
      return
    }

    setIsProcessing(true)

    try {
      const normalizedShippingData = normalizeShippingData(shippingData || {})

      const isCOD = paymentData?.method === 'Cash on Delivery'
      const backendPaymentMethod = isCOD ? 'cod' : 'card'

      const orderPayload = {
        items: safeCart.map(item => ({
          ...item,
          watch: item._id
        })),
        shippingAddress: normalizedShippingData,
        payment: paymentData,
        cardData: isCOD ? null : {
          number: String(paymentData?.cardNumber || '').replace(/\D/g, ''),
          name: paymentData?.cardName || '',
          expiry: paymentData?.expiry || '',
          cvv: paymentData?.cvv || '',
        },
        paymentMethod: backendPaymentMethod,
        totalPrice: safeTotalPrice,
        // Transitional fields for compatibility with legacy mock payload readers.
        shipping: normalizedShippingData,
        totalAmount: safeTotalPrice,
      }

      await orderService.create(orderPayload)
      dispatch({ type: 'CLEAR' })
      toast.success(t('checkout.orderPlaced'))
      setIsSuccess(true)
    } catch (err) {
      toast.error(err.message || t('checkout.processFailed'))
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="checkout-success">
        <h1 className="checkout-success__title">{t('checkout.confirmed')}</h1>
        <p className="checkout-success__message">
          {t('checkout.successMessage')}
        </p>
        <Button to="/shop" variant="primary" className="checkout-success__action">
          {t('checkout.returnShop')}
        </Button>
      </main>
    )
  }

  if (isCartEmpty) {
    return (
      <main className="checkout-empty">
        <h1 className="checkout-empty__title">{t('checkout.emptyTitle')}</h1>
        <p className="checkout-empty__message">
          {t('checkout.emptyMessage')}
        </p>
        <Button to="/shop" variant="primary" className="checkout-empty__action">
          {t('checkout.browseCollection')}
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
  const checkoutSteps = [
    { id: 1, label: t('checkout.shipping') },
    { id: 2, label: t('checkout.payment') },
    { id: 3, label: t('checkout.review') },
  ]

  return (
    <main className="checkout-page">
      <CheckoutSteps currentStep={step} steps={checkoutSteps} onStepChange={setStep} />

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

