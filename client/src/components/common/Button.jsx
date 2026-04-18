import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import './Button.css'

export default function Button({ 
  children, 
  to, 
  href, 
  variant = 'primary', 
  className,
  onClick,
  type = 'button',
  ...props 
}) {
  const baseClassName = cn('btn', `btn--${variant}`, className)

  if (to) {
    return (
      <Link to={to} className={baseClassName} onClick={onClick} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={baseClassName} onClick={onClick} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={baseClassName} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
