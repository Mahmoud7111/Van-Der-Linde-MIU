/**
 * Order service.
 * User order history + admin order management.
 */
import { apiGet, apiPost, apiPut } from '@/services/http'

export const orderService = {
  getMyOrders: () => apiGet('/orders/mine'),
  getAll: () => apiGet('/orders'),
  getById: (id) => apiGet(`/orders/${id}`),
  create: (data) => apiPost('/orders', data),
  updateStatus: (id, status) => apiPut(`/orders/${id}/status`, { status }),
  markAsPaid: (id) => apiPut(`/orders/${id}/pay`, {}),
  validateBin: (bin) => apiGet(`/orders/validate-bin/${bin}`),
}
