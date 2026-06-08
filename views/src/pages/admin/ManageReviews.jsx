import { useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { FiTrash2, FiStar, FiCheckCircle, FiMessageSquare } from 'react-icons/fi'
import PageTransition from '@/components/common/PageTransition'
import AdminShell from '@/components/admin/AdminShell'
import { reviewService } from '@/services/reviewService'
import { formatDate } from '@/utils/formatters'
import toast from 'react-hot-toast'
import './ManageReviews.css'

const fadeContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
}

const fadeItem = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0 },
}

const renderStars = (rating) => {
  const r = Math.round(Number(rating) || 0)
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < r ? 'admin-reviews__star admin-reviews__star--filled' : 'admin-reviews__star'}>
      ★
    </span>
  ))
}

export default function ManageReviews() {
  const [reviews, setReviews]     = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [search, setSearch]       = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [deletingId, setDeletingId]     = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const data = await reviewService.getAll()
        if (active) setReviews(Array.isArray(data) ? data : [])
      } catch {
        if (active) {
          setLoadError('Unable to load reviews right now.')
          setReviews([])
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const summary = useMemo(() => {
    const total    = reviews.length
    const verified = reviews.filter((r) => r.isVerifiedPurchase).length
    const avgRating = total
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / total
      : 0
    return { total, verified, avgRating }
  }, [reviews])

  const filteredReviews = useMemo(() => {
    const q = search.trim().toLowerCase()
    return reviews.filter((r) => {
      const userName    = (r.user?.name  || '').toLowerCase()
      const userEmail   = (r.user?.email || '').toLowerCase()
      const watchName   = (r.watch?.name || '').toLowerCase()
      const comment     = (r.comment     || '').toLowerCase()
      const matchSearch = !q || userName.includes(q) || userEmail.includes(q) || watchName.includes(q) || comment.includes(q)
      const matchRating = ratingFilter === 'all' || Number(r.rating) === Number(ratingFilter)
      return matchSearch && matchRating
    })
  }, [reviews, search, ratingFilter])

  const handleDelete = async (review) => {
    const watchName = review.watch?.name || 'this watch'
    const userName  = review.user?.name  || review.user?.email || 'this user'
    if (!window.confirm(`Delete review by "${userName}" for "${watchName}"? This cannot be undone.`)) return
    setDeletingId(review._id)
    try {
      await reviewService.deleteById(review._id)
      setReviews((prev) => prev.filter((r) => r._id !== review._id))
      toast.success('Review deleted.')
    } catch (err) {
      toast.error(err?.message || 'Failed to delete review.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <PageTransition>
      <AdminShell>
        <section className="admin-reviews">
          <div className="admin-reviews__inner">

            {/* Header */}
            <header className="admin-reviews__header">
              <p className="admin-reviews__eyebrow">Admin Console</p>
              <div className="admin-reviews__heading">
                <h1 className="admin-reviews__title">Manage Reviews</h1>
                <p className="admin-reviews__subtitle">
                  Monitor customer reviews, moderate content, and maintain catalogue quality.
                </p>
              </div>
            </header>

            {/* Summary cards */}
            <section className="admin-reviews__section" aria-labelledby="admin-reviews-summary">
              <div className="admin-reviews__section-header">
                <div>
                  <p className="admin-reviews__section-eyebrow">Summary</p>
                  <h2 id="admin-reviews-summary" className="admin-reviews__section-title">
                    Reviews overview
                  </h2>
                </div>
                <p className="admin-reviews__section-subtitle">
                  Total reviews, verified purchases, and average rating.
                </p>
              </div>

              <Motion.div
                className="admin-reviews__summary"
                variants={fadeContainer}
                initial="hidden"
                animate="show"
              >
                <Motion.article className="admin-reviews__summary-card" variants={fadeItem}>
                  <span className="admin-reviews__summary-icon"><FiMessageSquare /></span>
                  <p className="admin-reviews__summary-label">Total Reviews</p>
                  <p className="admin-reviews__summary-value">{isLoading ? '...' : summary.total}</p>
                  <p className="admin-reviews__summary-meta">All-time submissions</p>
                </Motion.article>

                <Motion.article className="admin-reviews__summary-card" variants={fadeItem}>
                  <span className="admin-reviews__summary-icon"><FiCheckCircle /></span>
                  <p className="admin-reviews__summary-label">Verified Purchases</p>
                  <p className="admin-reviews__summary-value">{isLoading ? '...' : summary.verified}</p>
                  <p className="admin-reviews__summary-meta">Confirmed buyers</p>
                </Motion.article>

                <Motion.article className="admin-reviews__summary-card" variants={fadeItem}>
                  <span className="admin-reviews__summary-icon"><FiStar /></span>
                  <p className="admin-reviews__summary-label">Average Rating</p>
                  <p className="admin-reviews__summary-value">
                    {isLoading ? '...' : summary.avgRating.toFixed(1)}
                  </p>
                  <p className="admin-reviews__summary-meta">Out of 5.0</p>
                </Motion.article>
              </Motion.div>
            </section>

            {/* Table */}
            <section className="admin-reviews__section" aria-labelledby="admin-reviews-table">
              <div className="admin-reviews__section-header">
                <div>
                  <p className="admin-reviews__section-eyebrow">Directory</p>
                  <h2 id="admin-reviews-table" className="admin-reviews__section-title">
                    All reviews
                  </h2>
                </div>
                <p className="admin-reviews__section-subtitle">
                  {isLoading ? 'Loading…' : `${filteredReviews.length} of ${summary.total} reviews match your filters.`}
                </p>
              </div>

              {/* Controls */}
              <div className="admin-reviews__controls">
                <div className="admin-reviews__search-group">
                  <input
                    id="review-search"
                    type="search"
                    className="admin-reviews__search-input"
                    placeholder="Search by user, watch or comment…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="admin-reviews__search-btn">Search</button>
                </div>
                <div className="admin-reviews__filter-group">
                  <select
                    className="admin-reviews__rating-select"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <option value="all">All ratings</option>
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                  </select>
                </div>
              </div>

              {loadError && <p className="admin-reviews__error">{loadError}</p>}

              <div className="admin-reviews__table-wrapper">
                <table className="admin-reviews__table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Watch</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Verified</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <Motion.tbody variants={fadeContainer} initial="hidden" animate="show">
                    {isLoading ? (
                      <Motion.tr variants={fadeItem}>
                        <td className="admin-reviews__empty" colSpan={7}>Loading reviews…</td>
                      </Motion.tr>
                    ) : filteredReviews.length === 0 ? (
                      <Motion.tr variants={fadeItem}>
                        <td className="admin-reviews__empty" colSpan={7}>No reviews match the current filters.</td>
                      </Motion.tr>
                    ) : (
                      filteredReviews.map((review) => (
                        <Motion.tr key={review._id} variants={fadeItem}>
                          <td className="admin-reviews__user">
                            <div className="admin-reviews__avatar" aria-hidden="true">
                              {((review.user?.name || review.user?.email || '?')[0]).toUpperCase()}
                            </div>
                            <div>
                              <span className="admin-reviews__user-name">
                                {review.user?.name || '—'}
                              </span>
                              <span className="admin-reviews__user-email">
                                {review.user?.email || '—'}
                              </span>
                            </div>
                          </td>
                          <td className="admin-reviews__watch">
                            {review.watch?.name || '—'}
                          </td>
                          <td className="admin-reviews__rating">
                            <div className="admin-reviews__stars">
                              {renderStars(review.rating)}
                            </div>
                            <span className="admin-reviews__rating-num">{review.rating}/5</span>
                          </td>
                          <td className="admin-reviews__comment">
                            {review.comment
                              ? review.comment.length > 80
                                ? `${review.comment.slice(0, 80)}…`
                                : review.comment
                              : <em className="admin-reviews__no-comment">No comment</em>
                            }
                          </td>
                          <td>
                            <span className={`admin-reviews__verified admin-reviews__verified--${review.isVerifiedPurchase ? 'yes' : 'no'}`}>
                              {review.isVerifiedPurchase ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="admin-reviews__date">
                            {formatDate(review.createdAt) || '—'}
                          </td>
                          <td>
                            <button
                              className="admin-reviews__action-btn admin-reviews__action-btn--delete"
                              title="Delete review"
                              disabled={deletingId === review._id}
                              onClick={() => handleDelete(review)}
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
