import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { resolveWatchProductImage } from '@/utils/watchImageResolver';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const data = await orderService.getById(orderId);
          setOrder(data);
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return <div className="order-confirmation">{t('orderConfirmation.loading')}</div>;
  }

  if (!order) {
    return (
      <div className="order-confirmation">
        <h1>{t('orderConfirmation.title')}</h1>
        <p>{t('orderConfirmation.thankYou')}</p>
        <p>{t('orderConfirmation.emailSoon')}</p>
      </div>
    );
  }

  const items = Array.isArray(order?.items) ? order.items : [];
  const shippingAddress = order?.shippingAddress || order?.shipping || {};
  const total = Number.isFinite(Number(order?.totalPrice))
    ? Number(order.totalPrice)
    : Number(order?.totalAmount || order?.total || 0);
  const fullName = shippingAddress?.fullName || shippingAddress?.name || '-';
  const zip = shippingAddress?.zip || shippingAddress?.postalCode || '-';

  return (
    <div className="order-confirmation">
      <h1>{t('orderConfirmation.title')}</h1>
      <p>{t('orderConfirmation.thankYouWithDetails')}</p>
      <div className="order-details">
        <h2>{t('orderConfirmation.orderLabel')} #{order._id}</h2>
        <div className="order-items">
          {items.map((item, index) => (
            <div key={item?._id || item?.id || `item-${index}`} className="order-item">
              <img src={resolveWatchProductImage(item?.image || item?.images?.[0])} alt={item?.name || 'Watch'} />
              <div>
                <h3>{item?.name || 'Watch'}</h3>
                <p>{t('orderConfirmation.quantity')}: {Number(item?.quantity) || 1}</p>
                <p>{t('orderConfirmation.price')}: {formatPrice(Number(item?.price) || 0)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <p>{t('orderConfirmation.total')}: {formatPrice(total)}</p>
          <p>{t('orderConfirmation.status')}: {order.status}</p>
        </div>
        <div className="shipping-address">
          <h3>{t('orderConfirmation.shippingAddress')}</h3>
          <p>{fullName}</p>
          <p>{shippingAddress?.street || '-'}</p>
          <p>{shippingAddress?.city || '-'}, {shippingAddress?.country || '-'} {zip}</p>
          <p>{shippingAddress?.email || '-'}</p>
          <p>{shippingAddress?.phone || '-'}</p>
        </div>
      </div>
    </div>
  );
}
