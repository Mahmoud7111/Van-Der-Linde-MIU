import Button from '@/components/common/Button'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/utils/cn'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import './OrderReview.css'

const DEFAULT_CART = { items: [], subtotal: 0, tax: 0, shippingCost: 0, total: 0 }

const getPaymentSummary = (paymentData = {}) => {
  const fallbackMethod = paymentData.method || paymentData.paymentMethod || 'Credit Card'
  const digits = String(paymentData.cardNumber || '').replace(/\D/g, '')
  const last4 = paymentData.last4 || digits.slice(-4)

  return {
    method: fallbackMethod,
    brand: paymentData.brand || 'Card',
    last4,
  }
}

export default function OrderReview({
  cart = DEFAULT_CART,
  shippingData = {},
  paymentData = {},
  onPlaceOrder,
  onEditShipping,
  onEditPayment,
  onBack,
  isProcessing = false,
  className,
}) {
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const paymentSummary = getPaymentSummary(paymentData)
  const fullName = shippingData.fullName || shippingData.name || '-'
  const zip = shippingData.zip || shippingData.postalCode || '-'

  return (
    <section className={cn('order-review', className)} aria-label={t('checkout.reviewAria')}>
      <header className="order-review__header">
        <h2 className="order-review__title">{t('checkout.reviewTitle')}</h2>
      </header>

      <div className="order-review__content">
        <section className="order-review__items-section" aria-label={t('checkout.orderItems')}>
          <ul className="order-review__item-list">
            {cart.items.map((item, index) => {
              const itemId = item?._id || item?.id || `${item?.name || 'item'}-${index}`
              const imageSource = item?.image || item?.images?.[0] || ''
              const quantity = Number(item?.quantity) || 1
              const giftWrappingPrice = Number(item?.giftWrappingPrice) || 0
              const linePrice = ((Number(item?.price) || 0) + giftWrappingPrice) * quantity

              return (
                <li key={itemId} className="order-review__item">
                  <figure className="order-review__item-figure">
                    <div className="order-review__item-image-wrapper">
                      <img
                        src={resolveWatchProductImage(imageSource)}
                        alt={t('checkout.imageOf', {
                          brand: (typeof item?.brand === 'object' ? item.brand?.name : item?.brand) || 'Van Der Linde',
                          name: item?.name || t('product.watchFallbackAlt'),
                        })}
                        className="order-review__item-image"
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="order-review__item-details">
                      <span className="order-review__item-brand">{(typeof item?.brand === 'object' ? item.brand?.name : item?.brand) || 'Van Der Linde'}</span>
                      <h3 className="order-review__item-name">{item?.name || t('product.watchFallbackAlt')}</h3>
                      <span className="order-review__item-qty">{t('checkout.qty', { quantity })}</span>
                      {item?.isGift && (
                        <span className="order-review__item-qty">
                          Gift for {item.recipientName || 'recipient'}
                          {item.giftWrappingName ? `, ${item.giftWrappingName}` : ''}
                          {giftWrappingPrice > 0 ? ` (+${formatPrice(giftWrappingPrice)})` : ''}
                        </span>
                      )}
                    </figcaption>
                  </figure>
                  <div className="order-review__item-price-wrapper">
                    <span className="order-review__item-price">
                      {formatPrice(linePrice)}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <div className="order-review__info-grid">
          <article className="order-review__info-block" aria-label={t('checkout.shippingDetails')}>
            <div className="order-review__info-header">
              <h3 className="order-review__info-title">{t('checkout.shippingAddress')}</h3>
              {onEditShipping && (
                <button
                  type="button"
                  className="order-review__info-edit"
                  onClick={onEditShipping}
                  disabled={isProcessing}
                >
                  {t('account.edit')}
                </button>
              )}
            </div>
            <address className="order-review__info-content">
              {fullName}
              <br />
              {shippingData.street || '-'}
              <br />
              {shippingData.city || '-'}, {zip}
              <br />
              {shippingData.country || '-'}
              <br />
              {shippingData.email || '-'}
              <br />
              {shippingData.phone || '-'}
            </address>
          </article>

          <article className="order-review__info-block" aria-label={t('checkout.paymentDetails')}>
            <div className="order-review__info-header">
              <h3 className="order-review__info-title">{t('checkout.paymentMethod')}</h3>
              {onEditPayment && (
                <button
                  type="button"
                  className="order-review__info-edit"
                  onClick={onEditPayment}
                  disabled={isProcessing}
                >
                  {t('account.edit')}
                </button>
              )}
            </div>
            <div className="order-review__info-content">
              <span className="order-review__payment-method">{paymentSummary.method}</span>
              {paymentSummary.last4 && (
                <span className="order-review__payment-card">
                  {t('checkout.paymentEnding', { brand: paymentSummary.brand, last4: paymentSummary.last4 })}
                </span>
              )}
            </div>
          </article>
        </div>

        <section className="order-review__summary-section" aria-label={t('checkout.orderTotals')}>
          <dl className="order-review__totals">
            <div className="order-review__total-row">
              <dt className="order-review__total-label">{t('cart.subtotal')}</dt>
              <dd className="order-review__total-value">{formatPrice(cart.subtotal || 0)}</dd>
            </div>
            <div className="order-review__total-row">
              <dt className="order-review__total-label">{t('checkout.shipping')}</dt>
              <dd className="order-review__total-value">
                {Number(cart.shippingCost) === 0
                  ? t('checkout.complimentary')
                  : formatPrice(cart.shippingCost || 0)}
              </dd>
            </div>
            <div className="order-review__total-row">
              <dt className="order-review__total-label">{t('cart.estimatedTax')}</dt>
              <dd className="order-review__total-value">{formatPrice(cart.tax || 0)}</dd>
            </div>
            <div className="order-review__total-row order-review__total-row--final">
              <dt className="order-review__total-label">{t('cart.total')}</dt>
              <dd className="order-review__total-value">{formatPrice(cart.total || 0)}</dd>
            </div>
          </dl>
        </section>

        <footer className="order-review__footer">
          <div className="order-review__footer-actions">
            {onBack && (
              <Button
                type="button"
                variant="ghost"
                className="order-review__back-btn"
                onClick={onBack}
                disabled={isProcessing}
              >
                {t('checkout.backPayment')}
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              className="order-review__submit-btn"
              onClick={onPlaceOrder}
              disabled={isProcessing}
              isLoading={isProcessing}
            >
              {t('checkout.placeOrder')}
            </Button>
          </div>
        </footer>
      </div>
    </section>
  )
}
