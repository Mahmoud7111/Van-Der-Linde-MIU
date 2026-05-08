import { useEffect, useMemo, useState } from 'react'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import AdminShell from '@/components/admin/AdminShell'
import { useCurrency } from '@/context/CurrencyContext'
import { orderService } from '@/services/orderService'
import { watchService } from '@/services/watchService'
import { LOW_STOCK_THRESHOLD } from '@/utils/constants'
import { formatRelativeTime } from '@/utils/formatters'
import './AdminDashboard.css'

const getOrderTotal = (order) => {
  const total = Number(order?.totalPrice ?? order?.totalAmount ?? order?.total)
  return Number.isFinite(total) ? total : 0
}

const getOrderDate = (order) => {
  const rawDate = order?.createdAt ?? order?.date
  if (!rawDate) return null
  const date = new Date(rawDate)
  return Number.isNaN(date.getTime()) ? null : date
}

const getOrderEmail = (order) =>
  order?.shippingAddress?.email?.trim() || order?.shipping?.email?.trim() || ''

const getOrderItems = (order) => {
  if (Array.isArray(order?.items)) return order.items
  if (Array.isArray(order?.products)) return order.products
  return []
}

const getCustomerName = (order) =>
  order?.shippingAddress?.fullName?.trim() ||
  order?.shippingAddress?.name?.trim() ||
  order?.shipping?.fullName?.trim() ||
  order?.shipping?.name?.trim() ||
  'Guest'

const formatStatusLabel = (status) => {
  const value = String(status || '').trim().toLowerCase()
  if (!value) return 'Pending'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const getStatusTone = (status) => {
  const value = String(status || '').trim().toLowerCase()
  if (value === 'delivered') return 'success'
  if (value === 'shipped') return 'info'
  if (value === 'processing' || value === 'pending') return 'warning'
  if (value === 'cancelled' || value === 'failed') return 'neutral'
  return 'neutral'
}

const getStockValue = (watch) => {
  const rawStock = Number(watch?.stock)
  return Number.isFinite(rawStock) ? rawStock : null
}

const isSameDay = (date, comparison) =>
  date &&
  comparison &&
  date.getFullYear() === comparison.getFullYear() &&
  date.getMonth() === comparison.getMonth() &&
  date.getDate() === comparison.getDate()

const isWithinDays = (date, days) => {
  if (!date) return false
  const now = new Date()
  const windowStart = new Date(now)
  windowStart.setDate(now.getDate() - days)
  windowStart.setHours(0, 0, 0, 0)
  return date >= windowStart
}

const buildMonthlySales = (orders) => {
  const now = new Date()
  const salesByMonth = new Map()

  orders.forEach((order) => {
    const date = getOrderDate(order)
    if (!date) return
    const key = `${date.getFullYear()}-${date.getMonth()}`
    salesByMonth.set(key, (salesByMonth.get(key) ?? 0) + getOrderTotal(order))
  })

  const months = []
  for (let index = 3; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
    const label = date.toLocaleString('en-US', { month: 'long' })
    const isCurrent = index === 0
    const key = `${date.getFullYear()}-${date.getMonth()}`
    months.push({
      label: isCurrent ? `${label} (Current Month)` : label,
      value: salesByMonth.get(key) ?? 0,
      isCurrent,
    })
  }

  return months
}

const buildTopReferences = (orders, days = 30) => {
  const totals = new Map()

  const relevantOrders = days
    ? orders.filter((order) => isWithinDays(getOrderDate(order), days))
    : orders

  relevantOrders.forEach((order) => {
    getOrderItems(order).forEach((item) => {
      const name = item?.name || item?._id || 'Unknown'
      const quantity = Number(item?.quantity) || 0
      if (!quantity) return
      totals.set(name, (totals.get(name) ?? 0) + quantity)
    })
  })

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, sold], index) => ({
      name,
      sold,
      highlight: index === 0 ? 'Bestseller' : undefined,
    }))
}
const buildOrderActivities = (orders) =>
  orders
    .map((order, index) => {
      const rawDate = order?.createdAt ?? order?.date
      const dateValue = rawDate ? new Date(rawDate) : null
      const statusLabel = formatStatusLabel(order?.status)

      return {
        id: order?._id || order?.id || `order-${index}`,
        event: `Order ${statusLabel}`,
        client: getCustomerName(order),
        status: statusLabel,
        tone: getStatusTone(order?.status),
        time: formatRelativeTime(rawDate) || 'Recently',
        sortKey: dateValue && !Number.isNaN(dateValue.getTime()) ? dateValue.getTime() : 0,
      }
    })
    .sort((a, b) => b.sortKey - a.sortKey)

const buildStockActivities = (watches) =>
  watches
    .filter((watch) => {
      const stockValue = getStockValue(watch)
      return stockValue !== null && stockValue > 0 && stockValue <= LOW_STOCK_THRESHOLD
    })
    .sort((a, b) => (getStockValue(a) ?? 0) - (getStockValue(b) ?? 0))
    .slice(0, 2)
    .map((watch, index) => ({
      id: watch?._id || `stock-${index}`,
      event: 'Stock level low',
      client: watch?.name || 'Reference',
      status: 'Restock',
      tone: 'warning',
      time: 'Inventory alert',
      sortKey: 0,
    }))

const buildCatalogActivity = (watches) => {
  if (!watches.length) return null

  const highlight = watches.reduce((best, watch) => {
    const currentScore = Number(watch?.rating) || 0
    const bestScore = Number(best?.rating) || 0
    return currentScore > bestScore ? watch : best
  }, watches[0])

  return {
    id: highlight?._id || 'catalog-activity',
    event: 'Catalog submission',
    client: highlight?.name || 'Reference',
    status: 'In Review',
    tone: 'info',
    time: 'Recently',
    sortKey: 0,
  }
}

const shortcuts = [
  { label: 'Manage Catalog', to: '/admin/watches' },
  { label: 'Review Orders', to: '/admin/orders' },
  { label: 'Audit Inventory', to: '/admin/watches' },
]

export default function AdminDashboard() {
  const { formatPrice } = useCurrency()
  const formatValue = (value, isCurrency) => (isCurrency ? formatPrice(value) : value)

  const [orders, setOrders] = useState([])
  const [watches, setWatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const displayValue = (value, isCurrency) => (isLoading ? '...' : formatValue(value, isCurrency))
  const displayCurrency = (value) => (isLoading ? '...' : formatPrice(value))

  useEffect(() => {
    let isActive = true

    const loadMetrics = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        const [ordersData, watchesData] = await Promise.all([
          orderService.getAll(),
          watchService.getAll(),
        ])

        if (!isActive) return
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setWatches(Array.isArray(watchesData) ? watchesData : [])
      } catch {
        if (!isActive) return
        setLoadError('Unable to load admin metrics right now.')
        setOrders([])
        setWatches([])
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadMetrics()

    return () => {
      isActive = false
    }
  }, [])

  const orderList = useMemo(() => (Array.isArray(orders) ? orders : []), [orders])
  const watchList = useMemo(() => (Array.isArray(watches) ? watches : []), [watches])

  const totalSales = useMemo(
    () => orderList.reduce((sum, order) => sum + getOrderTotal(order), 0),
    [orderList]
  )

  const ordersLast30Days = useMemo(
    () => orderList.filter((order) => isWithinDays(getOrderDate(order), 30)),
    [orderList]
  )

  const totalOrders = orderList.length
  const ordersLast30Count = ordersLast30Days.length
  const avgOrderValueLast30 = ordersLast30Count
    ? ordersLast30Days.reduce((sum, order) => sum + getOrderTotal(order), 0) / ordersLast30Count
    : 0

  const todaysSales = useMemo(() => {
    const today = new Date()
    return orderList.reduce((sum, order) => {
      const orderDate = getOrderDate(order)
      if (!isSameDay(orderDate, today)) return sum
      return sum + getOrderTotal(order)
    }, 0)
  }, [orderList])

  const customerCount = useMemo(() => {
    const customers = new Set()
    orderList.forEach((order) => {
      const email = getOrderEmail(order)
      if (!email) return
      customers.add(email.toLowerCase())
    })
    return customers.size
  }, [orderList])

  const lowStockCount = useMemo(() => {
    let lowStock = 0
    watchList.forEach((watch) => {
      const stockValue = getStockValue(watch)
      if (stockValue !== null && stockValue > 0 && stockValue <= LOW_STOCK_THRESHOLD) {
        lowStock += 1
      }
    })
    return lowStock
  }, [watchList])

  const monthlySales = useMemo(() => buildMonthlySales(orderList), [orderList])
  const topReferences = useMemo(() => buildTopReferences(orderList, 30), [orderList])
  const activityRows = useMemo(() => {
    const orderRows = buildOrderActivities(orderList)
    const stockRows = buildStockActivities(watchList)
    const catalogRow = buildCatalogActivity(watchList)

    const rows = []
    if (orderRows[0]) rows.push(orderRows[0])
    if (stockRows[0]) rows.push(stockRows[0])
    if (catalogRow) rows.push(catalogRow)

    let orderIndex = 1
    let stockIndex = 1
    while (rows.length < 4) {
      if (orderRows[orderIndex]) {
        rows.push(orderRows[orderIndex])
        orderIndex += 1
        continue
      }
      if (stockRows[stockIndex]) {
        rows.push(stockRows[stockIndex])
        stockIndex += 1
        continue
      }
      break
    }

    return rows.slice(0, 4)
  }, [orderList, watchList])

  const overviewCards = [
    {
      label: 'Total Sales',
      value: totalSales,
      meta: 'All-time revenue',
      isCurrency: true,
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      meta: 'All-time orders',
    },
    {
      label: 'Products Low On Stock',
      value: lowStockCount,
      meta: `${LOW_STOCK_THRESHOLD} or fewer left`,
    },
    {
      label: 'Customers',
      value: customerCount,
      meta: 'Active collectors',
    },
  ]

  const quickStats = [
    {
      label: "Today's Sales",
      value: todaysSales,
      isCurrency: true,
    },
    {
      label: 'New Orders (Last 30 Days)',
      value: ordersLast30Count,
    },
    {
      label: 'Avg. Order Price (Last 30 Days)',
      value: avgOrderValueLast30,
      isCurrency: true,
    },
  ]

  return (
    <PageTransition>
      <AdminShell>
        <section className="admin-dashboard">
          <div className="admin-dashboard__inner">
            <div className="admin-dashboard__hero-grid">
              {overviewCards.map((card) => (
                <article key={card.label} className="admin-dashboard__hero-card">
                  <p className="admin-dashboard__hero-label">{card.label}</p>
                  <p className="admin-dashboard__hero-value">{displayValue(card.value, card.isCurrency)}</p>
                  <p className="admin-dashboard__hero-meta">{card.meta}</p>
                </article>
              ))}
            </div>

            {loadError && <p className="admin-dashboard__error">{loadError}</p>}

            <section className="admin-dashboard__section" aria-labelledby="admin-shortcuts">
              <div className="admin-dashboard__section-header">
                <div>
                  <p className="admin-dashboard__section-eyebrow">Shortcuts</p>
                  <h2 id="admin-shortcuts" className="admin-dashboard__section-title">
                    Command bar
                  </h2>
                </div>
                <p className="admin-dashboard__section-subtitle">
                  Jump straight into the most used admin workflows.
                </p>
              </div>
              <div className="admin-dashboard__shortcuts">
                {shortcuts.map((shortcut) => (
                  <Button key={shortcut.label} to={shortcut.to} variant="secondary" size="sm">
                    {shortcut.label}
                  </Button>
                ))}
              </div>
            </section>

            <section className="admin-dashboard__section" aria-labelledby="admin-stats">
              <div className="admin-dashboard__section-header">
                <div>
                  <p className="admin-dashboard__section-eyebrow">Insights</p>
                  <h2 id="admin-stats" className="admin-dashboard__section-title">
                    Key metrics
                  </h2>
                </div>
                <p className="admin-dashboard__section-subtitle">
                  Snapshot of daily sales, new orders, and average order value.
                </p>
              </div>
              <div className="admin-dashboard__mini-grid">
                {quickStats.map((stat) => (
                  <article key={stat.label} className="admin-dashboard__mini-card">
                    <p className="admin-dashboard__mini-label">{stat.label}</p>
                    <p className="admin-dashboard__mini-value">{displayValue(stat.value, stat.isCurrency)}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="admin-dashboard__section" aria-labelledby="admin-panels">
              <div className="admin-dashboard__section-header">
                <div>
                  <p className="admin-dashboard__section-eyebrow">Operations</p>
                  <h2 id="admin-panels" className="admin-dashboard__section-title">
                    Performance overview
                  </h2>
                </div>
                <p className="admin-dashboard__section-subtitle">
                  Track monthly revenue and top references at a glance.
                </p>
              </div>
              <div className="admin-dashboard__panel-grid">
                <article className="admin-dashboard__panel">
                  <div className="admin-dashboard__panel-header">
                    <h3 className="admin-dashboard__panel-title">Monthly Sales</h3>
                    <span className="admin-dashboard__panel-meta">Current quarter</span>
                  </div>
                  <ul className="admin-dashboard__panel-list">
                    {monthlySales.map((item) => (
                      <li
                        key={item.label}
                        className={item.isCurrent ? 'admin-dashboard__panel-item admin-dashboard__panel-item--active' : 'admin-dashboard__panel-item'}
                      >
                        <span>{item.label}</span>
                        <span>{displayCurrency(item.value)}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="admin-dashboard__panel">
                  <div className="admin-dashboard__panel-header">
                    <h3 className="admin-dashboard__panel-title">Top References</h3>
                    <span className="admin-dashboard__panel-meta">Last 30 days</span>
                  </div>
                  <ol className="admin-dashboard__panel-list admin-dashboard__panel-list--ordered">
                    {isLoading ? (
                      <li className="admin-dashboard__panel-item">
                        <span>Loading order data</span>
                        <span className="admin-dashboard__panel-sold">...</span>
                      </li>
                    ) : topReferences.length === 0 ? (
                      <li className="admin-dashboard__panel-item">
                        <span>No orders yet</span>
                        <span className="admin-dashboard__panel-sold">0 sold</span>
                      </li>
                    ) : (
                      topReferences.map((item) => (
                        <li key={item.name} className="admin-dashboard__panel-item">
                          <div className="admin-dashboard__panel-name">
                            <span>{item.name}</span>
                            {item.highlight && (
                              <Badge variant="primary" size="sm">
                                {item.highlight}
                              </Badge>
                            )}
                          </div>
                          <span className="admin-dashboard__panel-sold">{item.sold} sold</span>
                        </li>
                      ))
                    )}
                  </ol>
                </article>
              </div>
            </section>

            <section className="admin-dashboard__section" aria-labelledby="admin-activity">
              <div className="admin-dashboard__section-header">
                <div>
                  <p className="admin-dashboard__section-eyebrow">Activity</p>
                  <h2 id="admin-activity" className="admin-dashboard__section-title">
                    Recent activity
                  </h2>
                </div>
                <p className="admin-dashboard__section-subtitle">
                  Monitor updates across orders, catalog submissions, and stock changes.
                </p>
              </div>
              <div className="admin-dashboard__table-wrapper">
                <table className="admin-dashboard__table">
                  <thead>
                    <tr>
                      <th scope="col">Update</th>
                      <th scope="col">Client</th>
                      <th scope="col">Status</th>
                      <th scope="col">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td className="admin-dashboard__table-empty" colSpan={4}>
                          Loading recent activity...
                        </td>
                      </tr>
                    ) : activityRows.length === 0 ? (
                      <tr>
                        <td className="admin-dashboard__table-empty" colSpan={4}>
                          No recent activity yet.
                        </td>
                      </tr>
                    ) : (
                      activityRows.map((row) => (
                        <tr key={row.id}>
                          <th scope="row">
                            <div className="admin-dashboard__table-title">{row.event}</div>
                            <span className="admin-dashboard__table-id">{row.id}</span>
                          </th>
                          <td className="admin-dashboard__table-client">{row.client}</td>
                          <td>
                            <span className={`admin-dashboard__status admin-dashboard__status--${row.tone}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="admin-dashboard__table-time">{row.time}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      </AdminShell>
    </PageTransition>
  )
}
