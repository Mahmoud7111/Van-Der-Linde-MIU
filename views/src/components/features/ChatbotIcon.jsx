import React from 'react'

// SVG chatbot icon styled to match brand theme
export default function ChatbotIcon({ size = 32, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <ellipse
        cx="20"
        cy="22"
        rx="15"
        ry="12"
        fill="var(--color-surface)"
        stroke="var(--color-gold)"
        strokeWidth="2.2"
      />
      <ellipse
        cx="13.5"
        cy="21.5"
        rx="2.2"
        ry="2.2"
        fill="var(--color-gold)"
      />
      <ellipse
        cx="26.5"
        cy="21.5"
        rx="2.2"
        ry="2.2"
        fill="var(--color-gold)"
      />
      <path
        d="M15.5 27c1.2 1.2 4.8 1.2 7 0"
        stroke="var(--color-brass)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse
        cx="20"
        cy="7.5"
        rx="4.5"
        ry="2.5"
        fill="var(--color-gold-light)"
        stroke="var(--color-gold)"
        strokeWidth="1.2"
      />
      <ellipse
        cx="20"
        cy="7.5"
        rx="2.2"
        ry="1.1"
        fill="var(--color-gold)"
        opacity="0.3"
      />
    </svg>
  )
}
