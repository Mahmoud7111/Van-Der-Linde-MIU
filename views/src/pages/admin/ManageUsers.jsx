import { useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { FiTrash2, FiUser, FiShield, FiUsers } from 'react-icons/fi'
import PageTransition from '@/components/common/PageTransition'
import AdminShell from '@/components/admin/AdminShell'
import { userService } from '@/services/userService'
import { formatDate } from '@/utils/formatters'
import toast from 'react-hot-toast'
import './ManageUsers.css'

const fadeContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
}

const fadeItem = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0 },
}

const getRoleTone = (role) => (role === 'admin' ? 'admin' : 'user')

export default function ManageUsers() {
  const [users, setUsers]       = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [search, setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const data = await userService.getAll()
        if (active) setUsers(Array.isArray(data) ? data : [])
      } catch {
        if (active) {
          setLoadError('Unable to load users right now.')
          setUsers([])
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const summary = useMemo(() => {
    const total  = users.length
    const admins = users.filter((u) => u.role === 'admin').length
    const active = users.filter((u) => u.isActive !== false).length
    return { total, admins, active }
  }, [users])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      const matchSearch =
        !q ||
        (u.name  || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      const matchRole =
        roleFilter === 'all' || (u.role || 'user') === roleFilter
      return matchSearch && matchRole
    })
  }, [users, search, roleFilter])

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete "${user.name || user.email}"? This cannot be undone.`)) return
    setDeletingId(user._id)
    try {
      await userService.deleteById(user._id)
      setUsers((prev) => prev.filter((u) => u._id !== user._id))
      toast.success(`User "${user.name || user.email}" deleted.`)
    } catch (err) {
      toast.error(err?.message || 'Failed to delete user.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <PageTransition>
      <AdminShell>
        <section className="admin-users">
          <div className="admin-users__inner">

            {/* Header */}
            <header className="admin-users__header">
              <p className="admin-users__eyebrow">Admin Console</p>
              <div className="admin-users__heading">
                <h1 className="admin-users__title">Manage Users</h1>
                <p className="admin-users__subtitle">
                  View, search and remove registered accounts from the platform.
                </p>
              </div>
            </header>

            {/* Summary cards */}
            <section className="admin-users__section" aria-labelledby="admin-users-summary">
              <div className="admin-users__section-header">
                <div>
                  <p className="admin-users__section-eyebrow">Summary</p>
                  <h2 id="admin-users-summary" className="admin-users__section-title">
                    Account overview
                  </h2>
                </div>
                <p className="admin-users__section-subtitle">
                  Total registered accounts, admins and active members.
                </p>
              </div>

              <Motion.div
                className="admin-users__summary"
                variants={fadeContainer}
                initial="hidden"
                animate="show"
              >
                <Motion.article className="admin-users__summary-card" variants={fadeItem}>
                  <span className="admin-users__summary-icon"><FiUsers /></span>
                  <p className="admin-users__summary-label">Total Users</p>
                  <p className="admin-users__summary-value">{isLoading ? '...' : summary.total}</p>
                  <p className="admin-users__summary-meta">All registered accounts</p>
                </Motion.article>

                <Motion.article className="admin-users__summary-card" variants={fadeItem}>
                  <span className="admin-users__summary-icon"><FiShield /></span>
                  <p className="admin-users__summary-label">Admins</p>
                  <p className="admin-users__summary-value">{isLoading ? '...' : summary.admins}</p>
                  <p className="admin-users__summary-meta">With elevated access</p>
                </Motion.article>

                <Motion.article className="admin-users__summary-card" variants={fadeItem}>
                  <span className="admin-users__summary-icon"><FiUser /></span>
                  <p className="admin-users__summary-label">Active</p>
                  <p className="admin-users__summary-value">{isLoading ? '...' : summary.active}</p>
                  <p className="admin-users__summary-meta">Enabled accounts</p>
                </Motion.article>
              </Motion.div>
            </section>

            {/* Table */}
            <section className="admin-users__section" aria-labelledby="admin-users-table">
              <div className="admin-users__section-header">
                <div>
                  <p className="admin-users__section-eyebrow">Directory</p>
                  <h2 id="admin-users-table" className="admin-users__section-title">
                    User accounts
                  </h2>
                </div>
                <p className="admin-users__section-subtitle">
                  {isLoading ? 'Loading…' : `${filteredUsers.length} of ${summary.total} users match your filters.`}
                </p>
              </div>

              {/* Controls */}
              <div className="admin-users__controls">
                <div className="admin-users__search-group">
                  <input
                    id="user-search"
                    type="search"
                    className="admin-users__search-input"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="admin-users__search-btn">Search</button>
                </div>
                <div className="admin-users__filter-group">
                  <select
                    className="admin-users__role-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              {loadError && <p className="admin-users__error">{loadError}</p>}

              <div className="admin-users__table-wrapper">
                <table className="admin-users__table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <Motion.tbody variants={fadeContainer} initial="hidden" animate="show">
                    {isLoading ? (
                      <Motion.tr variants={fadeItem}>
                        <td className="admin-users__empty" colSpan={7}>Loading users…</td>
                      </Motion.tr>
                    ) : filteredUsers.length === 0 ? (
                      <Motion.tr variants={fadeItem}>
                        <td className="admin-users__empty" colSpan={7}>No users match the current filters.</td>
                      </Motion.tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <Motion.tr key={user._id} variants={fadeItem}>
                          <td className="admin-users__name">
                            <div className="admin-users__avatar" aria-hidden="true">
                              {(user.name || user.email || '?')[0].toUpperCase()}
                            </div>
                            {user.name || '—'}
                          </td>
                          <td className="admin-users__email">{user.email || '—'}</td>
                          <td>
                            <span className={`admin-users__role admin-users__role--${getRoleTone(user.role)}`}>
                              {user.role || 'user'}
                            </span>
                          </td>
                          <td className="admin-users__phone">{user.phone || '—'}</td>
                          <td className="admin-users__date">{formatDate(user.createdAt) || '—'}</td>
                          <td>
                            <span className={`admin-users__status admin-users__status--${user.isActive === false ? 'inactive' : 'active'}`}>
                              {user.isActive === false ? 'Inactive' : 'Active'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="admin-users__action-btn admin-users__action-btn--delete"
                              title="Delete user"
                              disabled={deletingId === user._id}
                              onClick={() => handleDelete(user)}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </Motion.tr>
                      ))
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
