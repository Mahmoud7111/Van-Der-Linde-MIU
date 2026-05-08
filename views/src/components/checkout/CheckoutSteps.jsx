import { Fragment } from 'react'
import { cn } from '@/utils/cn'
import './CheckoutSteps.css'

const defaultSteps = [
  { id: 1, label: 'Shipping' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Review' },
]

export default function CheckoutSteps({
  currentStep = 1,
  steps = defaultSteps,
  className,
  onStepChange,
}) {
  return (
    <nav className={cn('checkout-steps', className)} aria-label="Checkout progress">
      <ol className="checkout-steps__list">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isActive = step.id === currentStep
          const isPending = step.id > currentStep

          let itemModifierClass = ''
          if (isCompleted) itemModifierClass = 'checkout-steps__item--completed'
          if (isActive) itemModifierClass = 'checkout-steps__item--active'
          if (isPending) itemModifierClass = 'checkout-steps__item--pending'

          const content = (
            <>
              <div className="checkout-steps__indicator">
                {isCompleted ? (
                  <svg
                    className="checkout-steps__check"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="checkout-steps__number">{step.id}</span>
                )}
              </div>
              <span className="checkout-steps__label">{step.label}</span>
            </>
          )

          return (
            <Fragment key={step.id}>
              <li
                className={cn('checkout-steps__item', itemModifierClass)}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted && onStepChange ? (
                  <button
                    type="button"
                    className="checkout-steps__link"
                    onClick={() => onStepChange(step.id)}
                  >
                    {content}
                  </button>
                ) : (
                  <div className="checkout-steps__wrapper">{content}</div>
                )}
              </li>

              {index < steps.length - 1 && (
                <li
                  className={cn(
                    'checkout-steps__connector',
                    step.id < currentStep && 'checkout-steps__connector--filled'
                  )}
                  aria-hidden="true"
                />
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
