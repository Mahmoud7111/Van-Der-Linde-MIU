import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import './CheckoutSteps.css';

const defaultSteps = [
  { id: 1, label: 'Sign In', path: '/checkout/sign-in' },
  { id: 2, label: 'Shipping', path: '/checkout/shipping' },
  { id: 3, label: 'Payment', path: '/checkout/payment' },
  { id: 4, label: 'Place Order', path: '/checkout/review' },
];

export default function CheckoutSteps({ 
  currentStep = 1, 
  steps = defaultSteps, 
  className 
}) {
  return (
    <nav 
      className={cn('checkout-steps', className)} 
      aria-label="Checkout progress"
    >
      <ol className="checkout-steps__list">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isPending = step.id > currentStep;

          let itemModifierClass = '';
          if (isCompleted) itemModifierClass = 'checkout-steps__item--completed';
          if (isActive) itemModifierClass = 'checkout-steps__item--active';
          if (isPending) itemModifierClass = 'checkout-steps__item--pending';

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
          );

          return (
            <React.Fragment key={step.id}>
              <li 
                className={cn('checkout-steps__item', itemModifierClass)}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Link to={step.path} className="checkout-steps__link">
                    {content}
                  </Link>
                ) : (
                  <div className="checkout-steps__wrapper">
                    {content}
                  </div>
                )}
              </li>
              
              {/* Connector line between steps (don't render after the last step) */}
              {index < steps.length - 1 && (
                <div 
                  className={cn('checkout-steps__connector', {
                    'checkout-steps__connector--filled': step.id < currentStep
                  })}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
