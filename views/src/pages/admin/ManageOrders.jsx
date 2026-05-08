import { useLoaderData, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { FiList, FiCheckCircle, FiSlash, FiX } from 'react-icons/fi'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import AdminShell from '@/components/admin/AdminShell'
import { useCurrency } from '@/context/CurrencyContext'
import { orderService } from '@/services/orderService'
import { formatDate } from '@/utils/formatters'
import { ORDER_STATUS } from '@/utils/constants'
import './ManageOrders.css'

import toast from 'react-hot-toast'


const fadeContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
}

const fadeItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

function getStatusVariant(status) {
  const s = (status || '').toLowerCase()
  if (s === 'delivered') return 'success'
  if (s === 'confirmed') return 'warning'
  if (s === 'shipped') return 'info'
  if (s === 'cancelled' || s === 'failed') return 'danger'
  return 'default' // pending and others fall back to default (gray)
} 


const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: ORDER_STATUS.PENDING, label: 'Pending' },
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: ORDER_STATUS.SHIPPED, label: 'Shipped' },
  { value: ORDER_STATUS.DELIVERED, label: 'Delivered' },
  { value: ORDER_STATUS.CANCELLED, label: 'Cancelled' },
]


const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
}

const STATUS_TONES = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.CONFIRMED]: 'neutral',
  [ORDER_STATUS.SHIPPED]: 'info',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger',
}

const getStatusLabel = (status) => STATUS_LABELS[status] ?? 'Unknown'
const getStatusTone = (status) => STATUS_TONES[status] ?? 'neutral'

const getOrderTotal = (order) => {
  const total = Number(order?.totalPrice ?? order?.totalAmount ?? order?.total)
  return Number.isFinite(total) ? total : 0
}

const getCustomerName = (order) =>
  order?.shippingAddress?.fullName?.trim() ||
  order?.shippingAddress?.name?.trim() ||
  order?.shipping?.fullName?.trim() ||
  order?.shipping?.name?.trim() ||
  'Guest'

const getCustomerEmail = (order) =>
  order?.shippingAddress?.email?.trim() ||
  order?.shipping?.email?.trim() ||
  ''
const getOrderDate = (order) => formatDate(order?.createdAt) || 'Date unavailable'

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const getOrderDateValue = (order) => {
  const rawDate = order?.createdAt ?? order?.date
  if (!rawDate) return null
  const date = new Date(rawDate)
  return Number.isNaN(date.getTime()) ? null : date
}

const getOrderItems = (order) => {
  if (Array.isArray(order?.items)) return order.items
  if (Array.isArray(order?.products)) return order.products
  return []
}

const getOrderItemLines = (order, maxItems = 3) => {
  const items = getOrderItems(order)

  return {
    lines: items.slice(0, maxItems).map((item) => {
      const quantity = Number(item?.quantity) || 1
      const name = item?.name || 'Item'
      return `${quantity} x ${name}`
    }),
    remaining: Math.max(items.length - maxItems, 0),
  }
}

const getPaidLabel = (order) => (order?.isPaid ? 'Yes' : 'No')

const isGiftOrder = (order) =>
  Boolean(order?.isGift || order?.gift || order?.giftOrder || order?.giftMessage)

const getGiftLabel = (order) => {
  if (order?.giftType === 'hybrid') return 'Hybrid'
  if (order?.giftType === 'yes' || isGiftOrder(order)) return 'Yes'
  return 'No'
}

const getFulfillmentDays = (order) => {
  const createdAt = getOrderDateValue(order)
  if (!createdAt) return null

  const status = String(order?.status ?? '').toLowerCase()
  const endDateRaw = order?.deliveredAt ?? order?.updatedAt ?? order?.shippedAt
  let endDate = endDateRaw ? new Date(endDateRaw) : null

  if (!endDate || Number.isNaN(endDate.getTime())) {
    if (status === ORDER_STATUS.SHIPPED || status === ORDER_STATUS.DELIVERED) {
      endDate = new Date()
    } else {
      return null
    }
  }

  const diffDays = (endDate - createdAt) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 ? diffDays : null
}

export default function ManageOrders() {
  const data = useLoaderData()
  const orders = useMemo(() => (Array.isArray(data) ? data : []), [data])
  const { formatPrice } = useCurrency()
  const [orderList, setOrderList] = useState(orders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setOrderList(orders)
  }, [orders])

  const summary = useMemo(() => {
    let pending = 0
    let delivered = 0
    let revenue = 0

    orderList.forEach((order) => {
      const status = String(order?.status ?? '').toLowerCase()
      if (status === ORDER_STATUS.PENDING) pending += 1
      if (status === ORDER_STATUS.DELIVERED) delivered += 1
      revenue += getOrderTotal(order)
    })

    return {
      total: orderList.length,
      pending,
      delivered,
      revenue,
    }
  }, [orderList])

  const deliveredCount = useMemo(
    () => orderList.filter((order) => String(order?.status ?? '').toLowerCase() === ORDER_STATUS.DELIVERED).length,
    [orderList]
  )

  const conversionRate = summary.total ? (deliveredCount / summary.total) * 100 : 0

  const giftCount = useMemo(
    () => orderList.filter((order) => isGiftOrder(order)).length,
    [orderList]
  )

  const giftRate = summary.total ? (giftCount / summary.total) * 100 : 0

  const avgFulfillmentDays = useMemo(() => {
    const samples = orderList
      .map((order) => getFulfillmentDays(order))
      .filter((value) => typeof value === 'number')

    if (samples.length === 0) return null

    const totalDays = samples.reduce((sum, value) => sum + value, 0)
    return totalDays / samples.length
  }, [orderList])

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()

    return orderList.filter((order) => {
      const id = String(order?._id ?? '').toLowerCase()
      const name = getCustomerName(order).toLowerCase()
      const email = getCustomerEmail(order).toLowerCase()
      const status = String(order?.status ?? '').toLowerCase()

      const matchQuery = !query || id.includes(query) || name.includes(query) || email.includes(query)
      const matchStatus = statusFilter === 'all' || status === statusFilter

      return matchQuery && matchStatus
    })
  }, [orderList, search, statusFilter])

  const canCreateShipment = (order) => {
    const status = String(order?.status ?? '').toLowerCase()
    return status === ORDER_STATUS.PENDING || status === ORDER_STATUS.CONFIRMED || status === 'processing'
  }

  const selectedCanCreateShipment = selectedOrder ? canCreateShipment(selectedOrder) : false

  const statusFlow = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
  ]

  const getNextStatus = (status) => {
    const current = String(status ?? '').toLowerCase()
    const index = statusFlow.indexOf(current)
    if (index === -1 || index === statusFlow.length - 1) {
      return ORDER_STATUS.DELIVERED
    }
    return statusFlow[index + 1]
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
  }

  const handleUpdateStatus = async (order, overrideStatus) => {
    if (!order?._id || isUpdating) return
    const nextStatus = overrideStatus ?? getNextStatus(order.status)

    setIsUpdating(true)

    try {
      await orderService.updateStatus(order._id, nextStatus)
      setOrderList((prev) =>
        prev.map((item) => (item._id === order._id ? { ...item, status: nextStatus } : item))
      )
      toast.success(`Order ${order._id} updated to ${getStatusLabel(nextStatus)}.`)
    } catch {
      toast.error('Unable to update order status right now.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateShipment = (order) => {
    const targetOrder = order ?? selectedOrder
    if (!targetOrder) {
      toast.error('Select an order to create a shipment.')
      return
    }

    handleUpdateStatus(targetOrder, ORDER_STATUS.SHIPPED)
  }

  const handleExportLedger = () => {
    const payload = JSON.stringify(filteredOrders, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'van-der-linde-orders.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Order ledger exported.')
  }

  return (
    <PageTransition>
      <AdminShell>
        <section className="admin-orders">
          <div className="admin-orders__inner">
            <header className="admin-orders__header">
              <p className="admin-orders__eyebrow">Admin Console</p>
              <div className="admin-orders__heading">
                <h1 className="admin-orders__title">Manage Orders</h1>
                <p className="admin-orders__subtitle">
                  Track fulfillment, confirm payments, and keep every collector on schedule.
                </p>
              </div>
              <div className="admin-orders__header-actions">
                <Button variant="secondary" onClick={handleExportLedger}>
                  Export ledger
                </Button>
              </div>
            </header>

            <section className="admin-orders__section" aria-labelledby="admin-orders-summary">
              <div className="admin-orders__section-header">
                <div>
                  <p className="admin-orders__section-eyebrow">Summary</p>
                  <h2 id="admin-orders-summary" className="admin-orders__section-title">
                    Fulfillment overview
                  </h2>
                </div>
                <p className="admin-orders__section-subtitle">
                  High-level progress across pending, delivered, and revenue milestones.
                </p>
              </div>
              <Motion.div className="admin-orders__summary" variants={fadeContainer} initial="hidden" animate="show">
                <Motion.article className="admin-orders__summary-card" variants={fadeItem}>
                  <p className="admin-orders__summary-label">Total orders</p>
                  <p className="admin-orders__summary-value">{summary.total}</p>
                  <p className="admin-orders__summary-meta">All-time orders</p>
                </Motion.article>
                <Motion.article className="admin-orders__summary-card" variants={fadeItem}>
                  <p className="admin-orders__summary-label">Pending</p>
                  <p className="admin-orders__summary-value">{summary.pending}</p>
                  <p className="admin-orders__summary-meta">Awaiting fulfillment</p>
                </Motion.article>
                <Motion.article className="admin-orders__summary-card" variants={fadeItem}>
                  <p className="admin-orders__summary-label">Delivered</p>
                  <p className="admin-orders__summary-value">{summary.delivered}</p>
                  <p className="admin-orders__summary-meta">Completed journeys</p>
                </Motion.article>
                <Motion.article className="admin-orders__summary-card" variants={fadeItem}>
                  <p className="admin-orders__summary-label">Revenue</p>
                  <p className="admin-orders__summary-value">{formatPrice(summary.revenue)}</p>
                  <p className="admin-orders__summary-meta">Gross sales volume</p>
                </Motion.article>
              </Motion.div>
            </section>

            <section className="admin-orders__section" aria-labelledby="admin-orders-table">
              <div className="admin-orders__section-header">
                <div>
                  <p className="admin-orders__section-eyebrow">Orders</p>
                  <h2 id="admin-orders-table" className="admin-orders__section-title">
                    Active orders
                  </h2>
                </div>
                <p className="admin-orders__section-subtitle">
                  {filteredOrders.length} of {summary.total} orders match your filters.
                </p>
              </div>

              <div className="admin-orders__overview">
                <article className="admin-orders__overview-card">
                  <div className="admin-orders__overview-header">
                    <p className="admin-orders__overview-label">Order Conversion Rate</p>
                    <span className="admin-orders__overview-value">{conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="admin-orders__progress" aria-hidden="true">
                    <span
                      className="admin-orders__progress-bar"
                      style={{ width: `${Math.min(conversionRate, 100)}%` }}
                    />
                  </div>
                  <p className="admin-orders__overview-meta">From cart to completed purchase</p>
                </article>
                <article className="admin-orders__overview-card">
                  <p className="admin-orders__overview-label">Avg. Fulfillment Time</p>
                  <p className="admin-orders__overview-value">
                    {avgFulfillmentDays === null ? 'N/A' : `${avgFulfillmentDays.toFixed(1)} days`}
                  </p>
                  <p className="admin-orders__overview-meta">From payment to shipment</p>
                </article>
                <article className="admin-orders__overview-card">
                  <p className="admin-orders__overview-label">Gift Orders</p>
                  <p className="admin-orders__overview-value">{giftRate.toFixed(1)}%</p>
                  <p className="admin-orders__overview-meta">Of total orders</p>
                </article>
              </div>

              <div className="admin-orders__controls">
                <div className="admin-orders__search-group">
                  <input
                    id="order-search"
                    type="search"
                    className="admin-orders__search-input"
                    placeholder="Search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <button className="admin-orders__search-btn">Search</button>
                </div>
              </div>

              <div className="admin-orders__table-wrapper">
                <table className="admin-orders__table">
                  <thead>
                    <tr>
                      <th>Number</th>
                      <th>User</th>
                      <th>Products</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Paid</th>
                      <th>Total</th>
                      <th>Gift</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <Motion.tbody variants={fadeContainer} initial="hidden" animate="show">
                    {filteredOrders.length === 0 ? (
                      <Motion.tr variants={fadeItem}>
                        <td className="admin-orders__empty" colSpan={6}>
                          No orders match the current filters.
                        </td>
                      </Motion.tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const id = order?._id || order?.id || '-'
                        const date = order?.createdAt || order?.date
                        const status = order?.status || 'pending'
                        const total = order?.totalPrice ?? order?.total ?? 0
                        const items = getOrderItemLines(order, 5)

                        return (
                          <Motion.tr key={id} variants={fadeItem}>
                            <td className="admin-orders__id">#{String(id).slice(-4)}</td>
                            <td className="admin-orders__customer-name">{getCustomerName(order)}</td>
                            <td className="admin-orders__products">
                              {items.lines.map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                              {items.remaining > 0 && <div>+ {items.remaining} more</div>}
                            </td>
                            <td className="admin-orders__date">{formatDateTime(date) || '-'}</td>
                            <td>
                              <Badge variant={getStatusVariant(status)} size="sm">
                                {status}
                              </Badge>
                            </td>
                            <td className="admin-orders__paid">{getPaidLabel(order)}</td>
                            <td className="admin-orders__total">{formatPrice(total)}</td>
                            <td className="admin-orders__gift">{getGiftLabel(order)}</td>
                            <td>
                              <div className="admin-orders__actions">
                                <Link to={`/order-confirmation?orderId=${id}`} className="admin-orders__action-btn admin-orders__action-btn--view" title="Details">
                                  <FiList />
                                </Link>
                                <select
                                  className="admin-orders__status-select"
                                  value={status.toLowerCase()}
                                  onChange={(e) => handleUpdateStatus(order, e.target.value)}
                                  disabled={isUpdating}
                                >
                                  {STATUS_OPTIONS.filter(o => o.value !== 'all').map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                                <button
                                  className="admin-orders__action-btn admin-orders__action-btn--delete"
                                  onClick={() => toast.error('Delete not implemented')}
                                  title="Delete order"
                                >
                                  <FiX />
                                </button>
                              </div>
                            </td>
                          </Motion.tr>
                        )
                      })
                    )}
                  </Motion.tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      </AdminShell>
    </PageTransition>
  )
}
