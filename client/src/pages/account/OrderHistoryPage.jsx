import { Link, useLoaderData } from 'react-router-dom'
import PageTransition from '@/components/common/PageTransition'
import Badge from '@/components/common/Badge'
import { useCurrency } from '@/context/CurrencyContext'
import { formatDate } from '@/utils/formatters'
import './OrderHistoryPage.css'

function getStatusVariant(status) {
  const s = (status || '').toLowerCase()
  if (s === 'delivered') return 'success'
  if (s === 'processing' || s === 'pending') return 'warning'
  if (s === 'cancelled' || s === 'failed') return 'danger'
  if (s === 'shipped') return 'info'
  return 'default'
}

export default function OrderHistoryPage() {
  const loaderData = useLoaderData()
  const { formatPrice } = useCurrency()
  const orders = Array.isArray(loaderData)
    ? loaderData
    : Array.isArray(loaderData?.orders)
      ? loaderData.orders
      : []

  return (
    <PageTransition>
      <section className="order-history-page">
        <div className="order-history-page__container">
          <header className="order-history-page__header">
            <p className="order-history-page__eyebrow">My Account</p>
            <h1 className="order-history-page__title">Order History</h1>
          </header>

          {orders.length === 0 ? (
            <div className="order-history-page__empty">
              <p>You have no orders yet.</p>
              <Link to="/shop" className="order-history-page__back">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="order-history-page__card">
              <div className="order-history-page__table-wrap">
                <table className="order-history-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => {
                      const id = order?._id || order?.id || '-'
                      const date = order?.createdAt || order?.date
                      const status = order?.status || 'pending'
                      const itemsCount =
                        order?.items?.length ??
                        order?.products?.length ??
                        order?.totalItems ??
                        0
                      const total = order?.totalPrice ?? order?.total ?? 0

                      return (
                        <tr key={id}>
                          <td className="order-history-table__id">#{String(id).slice(-8)}</td>
                          <td className="order-history-table__date">{formatDate(date) || '-'}</td>
                          <td>
                            <Badge variant={getStatusVariant(status)} size="sm">
                              {status}
                            </Badge>
                          </td>
                          <td className="order-history-table__items">{itemsCount}</td>
                          <td className="order-history-table__total">{formatPrice(total)}</td>
                          <td>
                            <div className="order-history-page__actions">
                              <Link to={`/account/orders/${id}`} className="order-history-link-btn">
                                Details
                              </Link>
                              <Link to="/contact" className="order-history-link-btn">
                                Help
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Link to="/account" className="order-history-page__back">
            Back to Account
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}