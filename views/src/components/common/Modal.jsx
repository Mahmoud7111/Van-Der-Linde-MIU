/*
  - Modal

  A reusable dialog component that can be used throughout the application. It handles opening and closing, keyboard accessibility (closing on Escape key), and prevents background scrolling when open. The modal content is centered and can be styled with additional classes passed via the className prop.

  - Props

    - isOpen: boolean -  Controls the visibility of the modal.
    - onClose: function -  Callback function called when the modal should close.
    - children: ReactNode -  The content to display inside the modal.
    - title: string -  Optional title displayed in the modal header.
    - className: string -  Optional additional CSS classes for the modal
*/

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

