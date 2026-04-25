import { cn } from '@/utils/cn'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import './CartSummary.css'

const toFiniteNumber = (value) => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

export default function CartSummary({
  subtotal,
  shippingCost = 0,
  tax = 0,
  total,
  isProcessing = false,
  onCheckout,
  className,
}) {
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  const safeSubtotal = toFiniteNumber(subtotal)
  const safeShippingCost = toFiniteNumber(shippingCost)
  const safeTax = toFiniteNumber(tax)
  const safeTotal = toFiniteNumber(total)

  return (
    <section className={cn('cart-summary', className)} aria-label={t('cart.summaryTitle')}>
      <h2 className="cart-summary__title">{t('cart.summaryTitle')}</h2>
      <dl className="cart-summary__list">
        <div className="cart-summary__row">
          <dt className="cart-summary__label">{t('cart.subtotal')}</dt>
          <dd className="cart-summary__value">{formatPrice(safeSubtotal)}</dd>
        </div>
        <div className="cart-summary__row">
          <dt className="cart-summary__label">{t('cart.estimatedShipping')}</dt>
          <dd className="cart-summary__value">
            {safeShippingCost === 0
              ? t('cart.calculatedAtCheckout')
              : formatPrice(safeShippingCost)}
          </dd>
        </div>
        <div className="cart-summary__row">
          <dt className="cart-summary__label">{t('cart.estimatedTax')}</dt>
          <dd className="cart-summary__value">{formatPrice(safeTax)}</dd>
        </div>
        <div className={cn('cart-summary__row', 'cart-summary__row--total')}>
          <dt className="cart-summary__label">{t('cart.total')}</dt>
          <dd className="cart-summary__value">{formatPrice(safeTotal)}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="cart-summary__checkout-btn"
        onClick={onCheckout}
        disabled={isProcessing}
        aria-busy={isProcessing}
      >
        {isProcessing ? t('cart.processing') : t('cart.proceedCheckout')}
      </button>
      <p className="cart-summary__note">{t('cart.checkoutNote')}</p>
    </section>
  )
}