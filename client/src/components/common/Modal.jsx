import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import { cn } from '@/utils/cn'
import Button from './Button'
import './Modal.css'

export default function Modal({ isOpen, onClose, children, title, className }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={cn('modal', className)} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {title && (
          <div className="modal__header">
            <h2 className="modal__title" id="modal-title">{title}</h2>
            <Button onClick={onClose} variant="ghost" size="sm" aria-label="Close modal">
              <FiX />
            </Button>
          </div>
        )}
        <div className="modal__content" aria-labelledby={title ? 'modal-title' : undefined}>
          {children}
        </div>
      </div>
    </div>
  )
}