import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import orderService from '../../services/orderService';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="order-confirmation">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="order-confirmation">
        <h1>Order Confirmation</h1>
        <p>Thank you for your order! Your order has been placed successfully.</p>
        <p>You will receive an email confirmation shortly.</p>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <h1>Order Confirmation</h1>
      <p>Thank you for your order! Here are the details:</p>
      <div className="order-details">
        <h2>Order #{order._id}</h2>
        <div className="order-items">
          {order.items.map((item) => (
            <div key={item._id} className="order-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <p>Total: ${order.totalPrice}</p>
          <p>Status: {order.status}</p>
        </div>
        <div className="shipping-address">
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.zip}</p>
          <p>{order.shippingAddress.email}</p>
          <p>{order.shippingAddress.phone}</p>
        </div>
      </div>
    </div>
  );
}
