import { useLoaderData } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import { useCurrency } from '@/context/CurrencyContext'
import { orderService } from '@/services/orderService'
import { formatDate } from '@/utils/formatters'
import { ORDER_STATUS } from '@/utils/constants'
import './ManageOrders.css'

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
  const total = Number(order?.totalPrice)
  return Number.isFinite(total) ? total : 0
}

const getCustomerName = (order) => order?.shippingAddress?.fullName?.trim() || 'Guest'
const getCustomerEmail = (order) => order?.shippingAddress?.email?.trim() || ''
const getOrderDate = (order) => formatDate(order?.createdAt) || 'Date unavailable'
const getItemCount = (order) => {
  const items = Array.isArray(order?.items) ? order.items : []
  const count = items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
  return count
}

export default function ManageOrders() {
  const data = useLoaderData()
  const orders = Array.isArray(data) ? data : []
  const { formatPrice } = useCurrency()
  const [orderList, setOrderList] = useState(orders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
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
    setStatusMessage(null)

    try {
      await orderService.updateStatus(order._id, nextStatus)
      setOrderList((prev) =>
        prev.map((item) => (item._id === order._id ? { ...item, status: nextStatus } : item))
      )
      setStatusMessage({
        type: 'success',
        message: `Order ${order._id} updated to ${getStatusLabel(nextStatus)}.`,
      })
    } catch (error) {
      setStatusMessage({ type: 'error', message: 'Unable to update order status right now.' })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateShipment = () => {
    if (!selectedOrder) {
      setStatusMessage({ type: 'error', message: 'Select an order to create a shipment.' })
      return
    }

    handleUpdateStatus(selectedOrder, ORDER_STATUS.SHIPPED)
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
    setStatusMessage({ type: 'success', message: 'Order ledger exported.' })
  }

  return (
    <PageTransition>
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
              <Button variant="primary" onClick={handleCreateShipment}>
                Create shipment
              </Button>
              <Button variant="secondary" onClick={handleExportLedger}>
                Export ledger
              </Button>
            </div>
            {statusMessage && (
              <p className={`admin-orders__status-message admin-orders__status-message--${statusMessage.type}`}>
                {statusMessage.message}
              </p>
            )}
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
            <div className="admin-orders__summary">
              <article className="admin-orders__summary-card">
                <p className="admin-orders__summary-label">Total orders</p>
                <p className="admin-orders__summary-value">{summary.total}</p>
                <p className="admin-orders__summary-meta">All-time orders</p>
              </article>
              <article className="admin-orders__summary-card">
                <p className="admin-orders__summary-label">Pending</p>
                <p className="admin-orders__summary-value">{summary.pending}</p>
                <p className="admin-orders__summary-meta">Awaiting fulfillment</p>
              </article>
              <article className="admin-orders__summary-card">
                <p className="admin-orders__summary-label">Delivered</p>
                <p className="admin-orders__summary-value">{summary.delivered}</p>
                <p className="admin-orders__summary-meta">Completed journeys</p>
              </article>
              <article className="admin-orders__summary-card">
                <p className="admin-orders__summary-label">Revenue</p>
                <p className="admin-orders__summary-value">{formatPrice(summary.revenue)}</p>
                <p className="admin-orders__summary-meta">Gross sales volume</p>
              </article>
            </div>
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

            {selectedOrder && (
              <div className="admin-orders__detail">
                <div>
                  <p className="admin-orders__detail-eyebrow">Selected order</p>
                  <h3 className="admin-orders__detail-title">{selectedOrder._id}</h3>
                  <p className="admin-orders__detail-meta">
                    {getCustomerName(selectedOrder)} · {getOrderDate(selectedOrder)}
                  </p>
                </div>
                <div className="admin-orders__detail-actions">
                  <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(selectedOrder)}>
                    Advance status
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                    Clear selection
                  </Button>
                </div>
              </div>
            )}

            <div className="admin-orders__filters" role="search">
              <div className="admin-orders__field admin-orders__field--search">
                <label className="admin-orders__label" htmlFor="order-search">
                  Search
                </label>
                <input
                  id="order-search"
                  type="search"
                  className="admin-orders__input"
                  placeholder="Search by order ID or customer"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="admin-orders__field">
                <label className="admin-orders__label" htmlFor="order-status">
                  Status
                </label>
                <select
                  id="order-status"
                  className="admin-orders__select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-orders__table-wrapper">
              <table className="admin-orders__table">
                <thead>
                  <tr>
                    <th scope="col">Order</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Date</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td className="admin-orders__empty" colSpan={6}>
                        No orders match the current filters.
                      </td>
                    </tr>
                  )}
                  {filteredOrders.map((order, index) => {
                    const status = String(order?.status ?? '').toLowerCase()
                    const itemCount = getItemCount(order)
                    const itemLabel = itemCount === 1 ? '1 item' : `${itemCount} items`
                    const paymentLabel = order?.isPaid ? 'Paid' : 'Payment pending'
                    const statusLabel = getStatusLabel(status)
                    const statusTone = getStatusTone(status)

                    return (
                      <tr key={order?._id ?? `order-${index}`}>
                        <th scope="row">
                          <div className="admin-orders__order">
                            <p className="admin-orders__order-id">{order?._id ?? 'Order ID'}</p>
                            <p className="admin-orders__order-meta">
                              {itemLabel} · {paymentLabel}
                            </p>
                          </div>
                        </th>
                        <td className="admin-orders__cell">
                          <p className="admin-orders__customer">{getCustomerName(order)}</p>
                          {getCustomerEmail(order) && (
                            <span className="admin-orders__customer-email">{getCustomerEmail(order)}</span>
                          )}
                        </td>
                        <td className="admin-orders__cell">{getOrderDate(order)}</td>
                        <td className="admin-orders__cell">{formatPrice(getOrderTotal(order))}</td>
                        <td className="admin-orders__cell">
                          <span className={`admin-orders__status admin-orders__status--${statusTone}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="admin-orders__cell">
                          <div className="admin-orders__actions">
                            <Button variant="secondary" size="sm" onClick={() => handleViewOrder(order)}>
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateStatus(order)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? 'Updating...' : 'Update'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </PageTransition>
  )
}
