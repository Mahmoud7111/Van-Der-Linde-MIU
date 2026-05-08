import { useRouteError, Link } from 'react-router-dom'
import { FiAlertCircle, FiHome, FiRefreshCw } from 'react-icons/fi'
import './ErrorPage.css'

export default function ErrorPage() {
  const error = useRouteError()
  console.error("Routing Error:", error)

  // Determine if it's a 404 Not Found error (useful for loader errors that throw 404s)
  const is404 = error?.status === 404 || error?.message?.includes('Not Found')

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="error-page">
      <div className="error-page__content">
        <FiAlertCircle className="error-page__icon" aria-hidden="true" />
        
        <h1 className="error-page__title">
          {is404 ? 'Page Not Found' : 'Something Went Wrong'}
        </h1>
        
        <p className="error-page__message">
          {is404 
            ? "We couldn't find the page or data you were looking for. It may have been moved or no longer exists." 
            : (error?.statusText || error?.message || "An unexpected error occurred while processing your request.")
          }
        </p>
        
        <div className="error-page__actions">
          <button className="error-page__btn error-page__btn--primary" onClick={handleRefresh}>
            <FiRefreshCw aria-hidden="true" /> Try Again
          </button>
          <Link to="/" className="error-page__btn error-page__btn--secondary">
            <FiHome aria-hidden="true" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
