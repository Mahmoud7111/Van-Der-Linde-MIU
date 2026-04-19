import { useState } from 'react';
import PropTypes from 'prop-types';
import { orderService } from '../../services/orderService';
import './OrderStatusStepper.css';

const statuses = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderStatusStepper({ order, onStatusUpdate }) {
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleStatusChange = async (newStatus) => {
    try {
      await orderService.updateStatus(order._id, newStatus);
      setCurrentStatus(newStatus);
      if (onStatusUpdate) {
        onStatusUpdate(order._id, newStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="order-status-stepper">
      {statuses.map((status, index) => (
        <button
          key={status}
          onClick={() => handleStatusChange(status)}
          disabled={index < currentIndex}
          className={`step ${index <= currentIndex ? 'active' : ''}`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

OrderStatusStepper.propTypes = {
  order: PropTypes.object.isRequired,
  onStatusUpdate: PropTypes.func,
};
