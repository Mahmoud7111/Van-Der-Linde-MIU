import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import DataTable from '../../components/admin/DataTable';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import OrderStatusStepper from '../../components/admin/OrderStatusStepper';
import './ManageOrders.css';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="manage-orders">Loading orders...</div>;
  }

  return (
    <div className="manage-orders">
      <h1>Manage Orders</h1>
      <DataTable
        data={orders}
        columns={[
          { key: '_id', label: 'Order ID' },
          { key: 'createdAt', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
          { key: 'shippingAddress.fullName', label: 'Customer', render: (_, order) => order.shippingAddress.fullName },
          { key: 'shippingAddress.email', label: 'Email', render: (_, order) => order.shippingAddress.email },
          { key: 'totalPrice', label: 'Total', render: (value) => `$${value}` },
          { key: 'status', label: 'Status', render: (value) => <OrderStatusBadge status={value} /> },
          { key: 'actions', label: 'Actions', render: (_, order) => (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSelectedOrder(order)}>View Details</button>
              <OrderStatusStepper order={order} onStatusUpdate={handleStatusUpdate} />
            </div>
          ) },
        ]}
      />
      {selectedOrder && (
        <div className="order-details-modal">
          <h2>Order Details - {selectedOrder._id}</h2>
          <p><strong>Customer:</strong> {selectedOrder.shippingAddress.fullName}</p>
          <p><strong>Email:</strong> {selectedOrder.shippingAddress.email}</p>
          <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
          <p><strong>Address:</strong> {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}</p>
          <h3>Items:</h3>
          <ul>
            {selectedOrder.items.map(item => (
              <li key={item._id}>{item.name} - Quantity: {item.quantity} - ${item.price}</li>
            ))}
          </ul>
          <p><strong>Total:</strong> ${selectedOrder.totalPrice}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>
          <button onClick={() => setSelectedOrder(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
