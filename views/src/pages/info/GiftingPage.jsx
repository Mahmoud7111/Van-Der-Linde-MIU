import { useEffect, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/common/Button'
import { FiGift, FiPenTool, FiMail, FiCheckCircle, FiX, FiInfo, FiTruck } from 'react-icons/fi'
import { useCurrency } from '@/context/CurrencyContext'
import { watchService } from '@/services/watchService'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import heritageImage from '@/assets/images/Photos/Heritage.avif'
import craftImage from '@/assets/images/Photos/About.png'
import goldFoilWrapImage from '@/assets/images/Photos/Gold Foil Wrap.png'
import velvetBoxImage from '@/assets/images/Photos/Velvet Box.jpg'
import './GiftingPage.css'

export default function GiftingPage() {
  const { formatPrice } = useCurrency()
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Gift State
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedWrap, setSelectedWrap] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [recipientName, setRecipientName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    watchService.getAll()
      .then((data) => {
        if (!isMounted) return
        setProducts(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!isMounted) return
        setProducts([])
      })

    return () => {
      isMounted = false
    }
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // Data for Wraps and Cards
  const wraps = [
    { id: 'silk', name: 'SILK RIBBON WRAP', price: 100, image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=400&auto=format&fit=crop' },
    { id: 'premium', name: 'Premium Gift Box', price: 150, image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=400&auto=format&fit=crop' },
    { id: 'velvet', name: 'VELVET BOX', price: 200, image: velvetBoxImage },
    { id: 'leather', name: 'Leather Case', price: 250, image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=400&auto=format&fit=crop' },
    { id: 'gold', name: 'GOLD FOIL WRAP', price: 120, image: goldFoilWrapImage }
  ]

  const cards = [
    { id: 'timeless', name: 'Timeless Moments', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=400&auto=format&fit=crop' },
    { id: 'legacy', name: 'The Legacy Gift', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=400&auto=format&fit=crop' },
    { id: 'celebration', name: 'Celebration of Life', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=400&auto=format&fit=crop' },
    { id: 'gratitude', name: 'Sincere Gratitude', image: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=80&w=400&auto=format&fit=crop' }
  ]

  const totalGiftPrice = (selectedProduct?.price || 0) + (selectedWrap?.price || 0)

  const handleNext = () => setCurrentStep(prev => prev + 1)
  const handleBack = () => setCurrentStep(prev => prev - 1)

  const resetGift = () => {
    setSelectedProduct(null)
    setSelectedWrap(null)
    setSelectedCard(null)
    setRecipientName('')
    setMessage('')
    setCurrentStep(1)
    setIsModalOpen(false)
  }

  return (
    <div className="gifting-page">
      {/* Hero Section */}
      <section id="gifting-hero" className="gifting-hero" style={{ backgroundImage: `url(${heritageImage})` }}>
        <div className="gifting-hero__overlay"></div>
        <Motion.div
          className="gifting-hero__content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <Motion.span className="gifting-hero__label" variants={fadeInUp}>
            The Art of Giving
          </Motion.span>
          <Motion.h1 className="gifting-hero__title" variants={fadeInUp}>
            Thoughtful Gifting <br /> Experience
          </Motion.h1>
          <Motion.p className="gifting-hero__subtitle" variants={fadeInUp}>
            Discover our curated collection of timepieces presented in elegant, handcrafted gift packaging for your most cherished moments.
          </Motion.p>
          <Motion.div variants={fadeInUp} style={{ marginTop: '2.5rem' }}>
            <Button onClick={() => { setIsModalOpen(true); setCurrentStep(1); }} variant="primary">Create Your Gift</Button>
          </Motion.div>
        </Motion.div>
      </section>

      {/* Gift Collections Section */}
      <section id="gift-collections" className="gift-collections">
        <div className="section-header">
          <Motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >Gift Collections</Motion.h2>
          <div className="divider-line"></div>
        </div>

        <div className="gift-grid">
          <Motion.div
            className="gift-item"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
          >
            <div className="gift-badge">Signature</div>
            <img src={craftImage} alt="Personalized Gift" className="gift-image" />
            <h3>Personalized Timepiece Gift</h3>
            <p className="gift-description">A curated selection with custom engraving, luxury wrap, and a personalized message.</p>
            <div className="gift-item__cta">Customize Now</div>
          </Motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="gift-features" className="gift-features">
        <div className="gift-features__container">
          <div className="feature-box">
            <div className="feature-icon"><FiGift /></div>
            <h4>Complimentary Wrapping</h4>
            <p>All gift orders include our signature wooden box and premium silk ribbon finishing.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon"><FiMail /></div>
            <h4>Handwritten Note</h4>
            <p>Include a personal message on our heavyweight cream stationery for a timeless touch.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon"><FiTruck /></div>
            <h4>White Glove Delivery</h4>
            <p>Priority handling and secure express delivery for all your precious gifts.</p>
          </div>
        </div>
      </section>

      {/* Gifting Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="gift-modal-overlay">
            <Motion.div
              className="gift-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button className="close-modal" onClick={resetGift}><FiX /></button>

              <div className="modal-progress">
                {[1, 2, 3, 4, 5].map(step => (
                  <div key={step} className={`progress-dot ${currentStep >= step ? 'active' : ''}`} />
                ))}
              </div>

              {/* Step 1: Product Selection */}
              {currentStep === 1 && (
                <Motion.div
                  className="modal-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2>Select a Timepiece</h2>
                  <p className="step-subtitle"><FiInfo /> Choose the perfect watch for your gift</p>

                  <div className="scroll-container">
                    {products.map(product => (
                      <div
                        key={product._id}
                        className={`selection-card ${selectedProduct?._id === product._id ? 'selected' : ''}`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="card-image-wrapper">
                          <img src={resolveWatchProductImage(product.images[0])} alt={product.name} />
                        </div>
                        <h3>{product.name}</h3>
                        <p className="price">{formatPrice(product.price)}</p>
                        <button className="select-btn">
                          {selectedProduct?._id === product._id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="step-actions">
                    <Button
                      variant="primary"
                      disabled={!selectedProduct}
                      onClick={handleNext}
                    >
                      Next Step
                    </Button>
                  </div>
                </Motion.div>
              )}

              {/* Step 2: Wrap Selection */}
              {currentStep === 2 && (
                <Motion.div
                  className="modal-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2>Choose Gift Wrapping</h2>
                  <p className="step-subtitle">Select our signature luxury packaging</p>

                  <div className="scroll-container">
                    {wraps.map(wrap => (
                      <div
                        key={wrap.id}
                        className={`selection-card ${selectedWrap?.id === wrap.id ? 'selected' : ''}`}
                        onClick={() => setSelectedWrap(wrap)}
                      >
                        {wrap.image && (
                          <div className="card-image-wrapper">
                            <img src={wrap.image} alt={wrap.name} />
                          </div>
                        )}
                        <h3>{wrap.name}</h3>
                        <p className="price">+{formatPrice(wrap.price)}</p>
                        <button className="select-btn">
                          {selectedWrap?.id === wrap.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="step-actions">
                    <Button variant="outline" onClick={handleBack}>Back</Button>
                    <Button
                      variant="primary"
                      disabled={!selectedWrap}
                      onClick={handleNext}
                    >
                      Next Step
                    </Button>
                  </div>
                </Motion.div>
              )}

              {/* Step 3: Card Selection */}
              {currentStep === 3 && (
                <Motion.div
                  className="modal-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2>Select a Greeting Card</h2>
                  <p className="step-subtitle">Pick a design for your handwritten message</p>

                  <div className="scroll-container">
                    {cards.map(card => (
                      <div
                        key={card.id}
                        className={`selection-card ${selectedCard?.id === card.id ? 'selected' : ''}`}
                        onClick={() => setSelectedCard(card)}
                      >
                        <div className="card-image-wrapper">
                          <img src={card.image} alt={card.name} />
                        </div>
                        <h3>{card.name}</h3>
                        <button className="select-btn">
                          {selectedCard?.id === card.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="step-actions">
                    <Button variant="outline" onClick={handleBack}>Back</Button>
                    <Button
                      variant="primary"
                      disabled={!selectedCard}
                      onClick={handleNext}
                    >
                      Next Step
                    </Button>
                  </div>
                </Motion.div>
              )}

              {/* Step 4: Message */}
              {currentStep === 4 && (
                <Motion.div
                  className="modal-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2>Personalize Your Gift</h2>

                  <div className="gift-form">
                    <div className="form-group">
                      <label>Recipient's Name</label>
                      <input
                        type="text"
                        placeholder="Who is this for?"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Your Message
                        <span className="char-count">{message.length}/100</span>
                      </label>
                      <textarea
                        placeholder="Write your heartfelt message here..."
                        maxLength="100"
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="preview-mini">
                      <p>Selected Card: <strong>{selectedCard?.name}</strong></p>
                    </div>
                  </div>

                  <div className="step-actions">
                    <Button variant="outline" onClick={handleBack}>Back</Button>
                    <Button
                      variant="primary"
                      disabled={!recipientName || !message}
                      onClick={handleNext}
                    >
                      Review Gift
                    </Button>
                  </div>
                </Motion.div>
              )}

              {/* Step 5: Confirmation */}
              {currentStep === 5 && (
                <Motion.div
                  className="modal-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2>Review Your Gift</h2>

                  <div className="summary-box">
                    <div className="summary-item">
                      <span>Timepiece:</span>
                      <strong>{selectedProduct?.name}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Wrapping:</span>
                      <strong>{selectedWrap?.name}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Card:</span>
                      <strong>{selectedCard?.name}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Recipient:</span>
                      <strong>{recipientName}</strong>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-total">
                      <span>Total Amount:</span>
                      <strong>{formatPrice(totalGiftPrice)}</strong>
                    </div>
                  </div>

                  <div className="success-message">
                    <FiCheckCircle />
                    <p>Your luxury gift is ready to be prepared.</p>
                  </div>

                  <div className="step-actions">
                    <Button variant="outline" onClick={handleBack}>Back</Button>
                    <Button variant="primary" onClick={resetGift}>Complete Order</Button>
                  </div>
                </Motion.div>
              )}
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Services Section (Old) */}
      <section className="gifting-services-info">
        <div className="gifting-services__container">
          <Motion.div
            className="gifting-services__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="gifting-services__title">Our Signature Services</h2>
          </Motion.div>

          <Motion.div
            className="gifting-services__grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <Motion.div className="gifting-service-card" variants={fadeInUp}>
              <span className="gifting-service-card__icon"><FiPenTool /></span>
              <h3 className="gifting-service-card__title">Personalized Engraving</h3>
              <p className="gifting-service-card__text">
                Add a lasting message, initials, or a significant date to the caseback of your chosen timepiece for a truly unique touch.
              </p>
            </Motion.div>

            <Motion.div className="gifting-service-card" variants={fadeInUp}>
              <span className="gifting-service-card__icon"><FiGift /></span>
              <h3 className="gifting-service-card__title">Luxury Gift Wrapping</h3>
              <p className="gifting-service-card__text">
                Each timepiece is housed in our signature wooden box and wrapped in premium textured paper with a hand-tied silk ribbon.
              </p>
            </Motion.div>

            <Motion.div className="gifting-service-card" variants={fadeInUp}>
              <span className="gifting-service-card__icon"><FiMail /></span>
              <h3 className="gifting-service-card__title">Bespoke Message Cards</h3>
              <p className="gifting-service-card__text">
                Include a personalized, hand-written note on our heavyweight cream stationery to convey your sentiments with elegance.
              </p>
            </Motion.div>
          </Motion.div>
        </div>
      </section>

      {/* Corporate Gifting Section */}
      <section className="gifting-corporate">
        <Motion.div
          className="gifting-corporate__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <span className="gifting-corporate__label">Business & Partnerships</span>
          <h2 className="gifting-corporate__title">Corporate Solutions</h2>
          <p className="gifting-corporate__text">
            Recognize outstanding achievement or celebrate a successful partnership with a Van Der Linde timepiece. Our corporate team provides tailored solutions.
          </p>
          <Button to="/contact" variant="outline">Inquire for Business</Button>
        </Motion.div>

        <Motion.div
          className="gifting-corporate__image"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.3 } } }}
        >
          <img src={craftImage} alt="Corporate Gifting" />
        </Motion.div>
      </section>
    </div>
  )
}
