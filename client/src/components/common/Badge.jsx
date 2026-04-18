import { cn } from '@/utils/cn'
import './Badge.css'

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...rest
}) {
  const badgeClassName = cn('badge', `badge--${variant}`, `badge--${size}`, className)

  return (
    <span className={badgeClassName} {...rest}>
      {children}
    </span>
  )
}

