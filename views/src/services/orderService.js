/**
 * Order service.
 * User order history + admin order management.
 */
import { apiGet, apiPost, apiPut } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'
import orders from '@/data/orders.json'
import products from '@/data/products.json'

const productImageById = products.reduce((lookup, product) => {
  if (!product?._id) return lookup
  lookup[product._id] = product?.images?.[0] || product?.image || ''
  return lookup
}, {})

const normalizeOrderItems = (items = []) =>
  (Array.isArray(items) ? items : []).map((item) => {
    const productImage = productImageById[item?._id] || ''
    const normalizedImage = item?.image || item?.images?.[0] || productImage
    return {
      ...item,
      image: normalizedImage,
      images: Array.isArray(item?.images) && item.images.length > 0
        ? item.images
        : normalizedImage
          ? [normalizedImage]
          : [],
    }
  })

// apply normalization to mock orders
const normalizedMockOrders = orders.map(order => ({
  ...order,
  items: normalizeOrderItems(order.items)
}))

const mock = {
  getMyOrders: () => Promise.resolve(normalizedMockOrders),
  getAll: () => Promise.resolve(normalizedMockOrders),
  getById: (id) => Promise.resolve(normalizedMockOrders.find((o) => o._id === id) || null),
  create: (data) => Promise.resolve({ ...data, _id: `order-${Date.now()}`, status: 'pending' }),
  updateStatus: (id, status) => Promise.resolve({ id, status }),
}

const real = {
  getMyOrders: () => apiGet('/orders/mine'),
  getAll: () => apiGet('/orders'),
  getById: (id) => apiGet(`/orders/${id}`),
  create: (data) => apiPost('/orders', data),
  updateStatus: (id, status) => apiPut(`/orders/${id}/status`, { status }),
}

export const orderService = USE_MOCK ? mock : real
