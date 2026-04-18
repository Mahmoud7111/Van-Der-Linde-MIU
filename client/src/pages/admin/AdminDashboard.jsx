import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import './AdminDashboard.css'

const kpis = [
  {
    label: 'Active watches',
    value: '52',
    meta: 'Curated in the live catalog',
    trend: '+4 new arrivals',
    tone: 'up',
  },
  {
    label: 'Orders in motion',
    value: '18',
    meta: 'Awaiting fulfillment updates',
    trend: '5 priority shipments',
    tone: 'neutral',
  },
  {
    label: 'Average rating',
    value: '4.8',
    meta: 'Across verified collectors',
    trend: '98% positive',
    tone: 'up',
  },
  {
    label: 'Inventory health',
    value: '92%',
    meta: 'In-stock references',
    trend: '3 items low',
    tone: 'warning',
  },
]

const quickActions = [
  {
    title: 'Refine the catalog',
    description: 'Audit pricing, imagery, and availability for each reference.',
    action: 'Manage watches',
    to: '/admin/watches',
  },
  {
    title: 'Prioritize orders',
    description: 'Review outstanding shipments and VIP delivery schedules.',
    action: 'Review orders',
    to: '/admin/orders',
  },
  {
    title: 'Curate a spotlight',
    description: 'Select the next heritage piece to feature on the homepage.',
    action: 'Create spotlight',
    to: '/admin/watches',
  },
]

const activityRows = [
  {
    id: 'ORD-3921',
    event: 'Order dispatched',
    client: 'Lena Hart',
    status: 'Shipped',
    tone: 'success',
    time: 'Today · 2:10 PM',
  },
  {
    id: 'CAT-108',
    event: 'New watch submitted',
    client: 'Aurum Atelier',
    status: 'In Review',
    tone: 'info',
    time: 'Today · 11:45 AM',
  },
  {
    id: 'ORD-3914',
    event: 'Payment awaiting approval',
    client: 'Marcus Vale',
    status: 'Attention',
    tone: 'warning',
    time: 'Yesterday · 6:03 PM',
  },
  {
    id: 'CAT-107',
    event: 'Inventory threshold reached',
    client: 'Ops Team',
    status: 'Restock',
    tone: 'neutral',
    time: 'Yesterday · 3:14 PM',
  },
]

export default function AdminDashboard() {
  return (
    <PageTransition>
      <section className="admin-dashboard">
        <div className="admin-dashboard__inner">
          <header className="admin-dashboard__header">
            <p className="admin-dashboard__eyebrow">Admin Console</p>
            <div className="admin-dashboard__heading">
              <h1 className="admin-dashboard__title">Aurum Control Room</h1>
              <p className="admin-dashboard__subtitle">
                Orchestrate the collection, fulfillment, and concierge touchpoints from one refined view.
              </p>
            </div>
            <div className="admin-dashboard__primary-actions">
              <Button to="/admin/watches" variant="primary">
                Manage Catalog
              </Button>
              <Button to="/admin/orders" variant="secondary">
                Review Orders
              </Button>
            </div>
          </header>

          <section className="admin-dashboard__section" aria-labelledby="admin-kpis">
            <div className="admin-dashboard__section-header">
              <div>
                <p className="admin-dashboard__section-eyebrow">Insights</p>
                <h2 id="admin-kpis" className="admin-dashboard__section-title">
                  Today at a glance
                </h2>
              </div>
              <p className="admin-dashboard__section-subtitle">
                A curated snapshot of catalog and fulfillment performance.
              </p>
            </div>
            <div className="admin-dashboard__kpis">
              {kpis.map((kpi) => (
                <article key={kpi.label} className="admin-dashboard__kpi-card">
                  <p className="admin-dashboard__kpi-label">{kpi.label}</p>
                  <p className="admin-dashboard__kpi-value">{kpi.value}</p>
                  <p className="admin-dashboard__kpi-meta">{kpi.meta}</p>
                  <span className={`admin-dashboard__kpi-trend admin-dashboard__kpi-trend--${kpi.tone}`}>
                    {kpi.trend}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-dashboard__section" aria-labelledby="admin-actions">
            <div className="admin-dashboard__section-header">
              <div>
                <p className="admin-dashboard__section-eyebrow">Actions</p>
                <h2 id="admin-actions" className="admin-dashboard__section-title">
                  Quick command center
                </h2>
              </div>
              <p className="admin-dashboard__section-subtitle">
                Move swiftly between catalog, orders, and showcase planning.
              </p>
            </div>
            <div className="admin-dashboard__action-grid">
              {quickActions.map((action) => (
                <article key={action.title} className="admin-dashboard__action-card">
                  <div>
                    <h3 className="admin-dashboard__action-title">{action.title}</h3>
                    <p className="admin-dashboard__action-body">{action.description}</p>
                  </div>
                  <Button to={action.to} variant="secondary">
                    {action.action}
                  </Button>
                </article>
              ))}
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
                Monitor the latest updates across operations and catalog submissions.
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
                  {activityRows.map((row) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </PageTransition>
  )
}
