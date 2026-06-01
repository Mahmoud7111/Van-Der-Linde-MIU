import Button from './Button'
import './EmptyState.css'

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__description">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// This EmptyState component is designed to display a message when there is no data to show. It includes a title, an optional description, and an optional action button that can trigger a callback function when clicked. The component is styled with CSS and can be reused across different parts of the application where an empty state needs to be communicated to the user. 
