import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import './Button.css'

/*
  Shared Button component.

  Rendering strategy:
  - Link tag: internal app navigation (react-router routes).
  - Anchor tag: external URLs.
  - Button tag: in-page actions and form submits.

  Styling strategy:
  - Generic variants (primary/secondary/ghost/danger) for reusable UI actions.
  - Home-specific variants (home-*) used by HomePage sections.
*/

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  active = false,
  className = '',
  to,
  href,
  ...rest
}) {
  // One disabled flag drives visual state and click behavior across all tag types.
  const isDisabled = disabled || isLoading

  // Compose base, variant, size, optional active state, then caller-provided className.
  const buttonClassName = cn('btn', `btn--${variant}`, `btn--${size}`, active && 'btn--active', className)

  const handleClick = (event) => {
    // Links do not support native disabled, so we block interaction manually.
    if (isDisabled) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    if (onClick) {
      onClick(event)
    }
  }

  // Loading replaces content with spinner for async actions.
  const buttonContent = isLoading ? <span className="btn__spinner" /> : children

  if (to) {
    // Internal navigation path, used in HomePage for route CTAs like Shop All.
    return (
      <Link
        to={to}
        onClick={handleClick}
        className={buttonClassName}
        aria-disabled={isDisabled || undefined}
        {...rest}
      >
        {buttonContent}
      </Link>
    )
  }

  if (href) {
    // External navigation path, used when a button should open a real URL.
    return (
      <a
        href={href}
        onClick={handleClick}
        className={buttonClassName}
        aria-disabled={isDisabled || undefined}
        {...rest}
      >
        {buttonContent}
      </a>
    )
  }

  // Default semantic button for click handlers and form actions.
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={buttonClassName}
      {...rest}
    >
      {buttonContent}
    </button>
  )
}