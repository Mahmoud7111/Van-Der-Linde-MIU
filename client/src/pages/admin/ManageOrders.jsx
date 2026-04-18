import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import DataTable from '../../components/admin/DataTable';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import OrderStatusStepper from '../../components/admin/OrderStatusStepper';
import './ManageOrders.css';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchOrders();
  }, []);

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
          { key: 'totalPrice', label: 'Total', render: (value) => `$${value}` },
          { key: 'status', label: 'Status', render: (value) => <OrderStatusBadge status={value} /> },
          { key: 'actions', label: 'Actions', render: (_, order) => <OrderStatusStepper order={order} /> },
        ]}
      />
    </div>
  );
}
