import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import './FaqPage.css'

const FAQ_DATA = [
  {
    category: "Ordering & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "All Van Der Linde timepieces are shipped via complimentary insured express delivery. Depending on your global region, delivery typically takes 2 to 5 business days."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to over 100 countries worldwide. All international shipments are fully insured and require a signature upon delivery to ensure your timepiece arrives securely."
      },
      {
        q: "Can I track my order?",
        a: "Once your timepiece leaves our atelier, you will receive a shipping confirmation email containing your secure tracking number and courier details."
      }
    ]
  },
  {
    category: "Warranty & Servicing",
    questions: [
      {
        q: "What is the warranty on a Van Der Linde watch?",
        a: "Every Van Der Linde timepiece comes with a comprehensive 5-year international warranty covering all manufacturing defects. Our commitment to excellence ensures your watch will perform flawlessly."
      },
      {
        q: "How often should my watch be serviced?",
        a: "We recommend a complete service every 4 to 5 years to maintain the precision of the mechanical movement and the water resistance of the case."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 14-day complimentary return policy. The timepiece must be unworn, in pristine condition, and returned with all original packaging, certificates, and accessories."
      }
    ]
  }
]

function FaqItem({ question, answer, isOpen, onClick }) {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button 
        className="faq-item__question" 
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <Motion.div 
          className="faq-item__icon"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <FiChevronDown />
        </Motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            className="faq-item__answer-wrapper"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="faq-item__answer">
              <p>{answer}</p>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = (categoryIndex, qIndex) => {
    const targetId = `${categoryIndex}-${qIndex}`
    setOpenIndex(prev => prev === targetId ? null : targetId)
  }

  return (
    <div className="faq-page">
      <header className="faq-page__header">
        <h1 className="faq-page__title">Frequently Asked Questions</h1>
        <p className="faq-page__subtitle">
          Find answers to common inquiries regarding our timepieces, services, and policies.
        </p>
      </header>

      <div className="faq-page__content">
        {FAQ_DATA.map((section, cIndex) => (
          <section key={section.category} className="faq-section">
            <h2 className="faq-section__title">{section.category}</h2>
            <div className="faq-section__list">
              {section.questions.map((item, qIndex) => (
                <FaqItem 
                  key={qIndex}
                  question={item.q}
                  answer={item.a}
                  isOpen={openIndex === `${cIndex}-${qIndex}`}
                  onClick={() => handleToggle(cIndex, qIndex)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
