import PropTypes from 'prop-types';
import Badge from '../common/Badge';
import './OrderStatusBadge.css';

export default function OrderStatusBadge({ status }) {
  const getVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return <Badge variant={getVariant(status)}>{status}</Badge>;
}

OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

