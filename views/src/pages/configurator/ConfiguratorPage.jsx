/**
 * ConfiguratorPage
 *
 * What this file is:
 * A 2D watch configurator for V1. Lets users pick case material, dial color,
 * and strap to compose a personalized watch. Updates live via React state.
 *
 * What it does:
 * - Renders a live SVG watch illustration that reflects user selections.
 * - Three configuration panels: case, dial, strap.
 * - Add to Cart button dispatches to CartContext.
 *
 * Where it is used:
 * Mounted at /configurator in routes/index.jsx.
 *
 * V2 note: Three.js 3D model replaces the SVG illustration. Logic stays identical.
 */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '@/context/CurrencyContext'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import Watch3DModel from '@/components/configurator/Watch3DModel'
import { cn } from '@/utils/cn'
import { configuratorService } from '@/services/configuratorService'
import './ConfiguratorPage.css'

import omegaModel from '@/assets/3D Models/Omega Sea Master.glb'
import santosModel from '@/assets/3D Models/Santos.glb'
import seikoModel from '@/assets/3D Models/seiko_watch.glb'
import classicWatchModel from '@/assets/3D Models/watch.glb'

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MODEL_OPTIONS
 * Defines the available 3D watches.
 * - path: The imported .glb file.
 * - price: The base cost of this specific model.
 * - cameraOrbit: Custom camera framing to ensure the watch looks its best on load.
 */
const MODEL_OPTIONS = [
  { id: 'omega', label: 'Omega Sea Master', path: omegaModel, price: 5200, cameraOrbit: "333deg 84deg auto" },
  { id: 'santos', label: 'Cartier Santos', path: santosModel, price: 6800, cameraOrbit: "333deg 84deg auto" },
  { id: 'seiko', label: 'Seiko Watch', path: seikoModel, price: 1200, cameraOrbit: "344deg 90deg auto" },
  { id: 'classic', label: 'Classic Watch', path: classicWatchModel, price: 2800, cameraOrbit: "245deg 39deg auto" },
]

const CASE_OPTIONS = [
  { id: 'original',    label: 'Original',    color: 'original', price: 0   },
  { id: 'silver',      label: 'Silver',      color: '#C0C0C8', price: 200  },
  { id: 'black',       label: 'Matte Black', color: '#1A1A1A', price: 300  },
  { id: 'white',       label: 'Glossy White', color: '#FFFFFF', price: 400  },
  { id: 'yellow-gold', label: 'Yellow Gold', color: '#C9A84C', price: 800  },
  { id: 'rose-gold',   label: 'Rose Gold',   color: '#D4956A', price: 700  },
]

const BEZEL_OPTIONS = [
  { id: 'original',    label: 'Original',    color: 'original', price: 0   },
  { id: 'silver',      label: 'Silver',      color: '#C0C0C8', price: 150  },
  { id: 'black',       label: 'Ceramic Black', color: '#1A1A1A', price: 300  },
  { id: 'white',       label: 'Ceramic White', color: '#F0F0F0', price: 350  },
  { id: 'blue',        label: 'Ceramic Blue', color: '#0D2340', price: 400  },
  { id: 'green',       label: 'Ceramic Green', color: '#1B3B2B', price: 400  },
]

const DIAL_OPTIONS = [
  { id: 'original',  label: 'Original',  color: 'original', textColor: '#0D1B2A', price: 0   },
  { id: 'white',     label: 'White',     color: '#F8F4EE', textColor: '#0D1B2A', price: 200 },
  { id: 'black',     label: 'Black',     color: '#141414', textColor: '#C9A84C', price: 250 },
  { id: 'blue',      label: 'Navy Blue', color: '#0D2340', textColor: '#E8C97A', price: 300 },
  { id: 'champagne', label: 'Champagne', color: '#E8D5A3', textColor: '#5A3E1B', price: 350 },
  { id: 'emerald',   label: 'Emerald',   color: '#064E3B', textColor: '#FFFFFF', price: 400 },
]

const STRAP_OPTIONS = [
  { id: 'original',      label: 'Original',      color: 'original', buckleColor: '#C0C0C8', price: 0   },
  { id: 'leather-black', label: 'Leather Black', color: '#1A1A1A', buckleColor: '#C0C0C8', price: 150 },
  { id: 'leather-brown', label: 'Leather Brown', color: '#6B3A2A', buckleColor: '#C0A060', price: 150 },
  { id: 'metal',         label: 'Metal Bracelet',color: '#B8B8C0', buckleColor: '#A0A0A8', price: 400 },
  { id: 'nato-green',    label: 'NATO Green',    color: '#3A5C3A', buckleColor: '#C0C0C8', price: 120 },
  { id: 'rubber-white',  label: 'Rubber White',  color: '#F5F5F5', buckleColor: '#C0C0C8', price: 180 },
]

// Base price is now model-dependent
const BASE_PRICE = 0

const configuratorSchema = Yup.object({
  name:  Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  notes: Yup.string(),
})

// ─────────────────────────────────────────────────────────────────────────────
// SWATCH BUTTON
// ─────────────────────────────────────────────────────────────────────────────

function SwatchButton({ color, label, selected, onClick }) {
  return (
    <button
      type="button"
      className={cn('cfg-swatch', selected && 'cfg-swatch--selected')}
      onClick={onClick}
      aria-label={label}
      aria-pressed={selected}
      title={label}
    >
      <span className="cfg-swatch__color" style={{ background: color }} />
      <span className="cfg-swatch__label">{label}</span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ConfiguratorPage() {
  const { formatPrice } = useCurrency()

  // Active selections — defaults to first option in each group
  const [selectedCase,  setSelectedCase]  = useState(CASE_OPTIONS[0])
  const [selectedBezel, setSelectedBezel] = useState(BEZEL_OPTIONS[0])
  const [selectedDial,  setSelectedDial]  = useState(DIAL_OPTIONS[0])
  const [selectedStrap, setSelectedStrap] = useState(STRAP_OPTIONS[0])
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0])

  // Active config panel tab
  const [activePanel, setActivePanel] = useState('model')

  // Request form state
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess,    setFormSuccess]    = useState(false)
  const [formError,      setFormError]      = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(configuratorSchema),
  })

  // ─────────────────────────────────────────────────────────────────────────────
  // PRICE CALCULATION
  // Sums the base model price + the premiums of each selected component.
  // ─────────────────────────────────────────────────────────────────────────────
  const totalPrice = BASE_PRICE + 
                     (selectedModel?.price || 0) + 
                     (selectedCase?.price || 0) + 
                     (selectedBezel?.price || 0) + 
                     (selectedDial?.price || 0) + 
                     (selectedStrap?.price || 0)

  return (
    <PageTransition>
      <div className="cfg-page">

        {/* ── PAGE HEADER ── */}
        <header className="cfg-header">
          <p className="cfg-header__eyebrow">Personalise</p>
          <h1 className="cfg-header__title">Configure Your Watch</h1>
          <p className="cfg-header__subtitle">
            Select each component to compose your timepiece. Every detail, your choice.
          </p>
        </header>

        {/* ── MAIN LAYOUT ── */}
        <div className="cfg-layout">

          {/* ── LEFT: WATCH PREVIEW ── */}
          <div className="cfg-preview">
            <div className="cfg-preview__stage">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={selectedModel.id}
                  className="cfg-preview__watch"
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1,    y: 0 }}
                  exit={{    opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* 
                    3D PREVIEW COMPONENT
                    Passes all current selections down. The Watch3DModel will
                    detect changes in these props and update the GLB materials automatically.
                  */}
                  <Watch3DModel
                    selectedModel={selectedModel}
                    caseOption={selectedCase}
                    bezelOption={selectedBezel}
                    dialOption={selectedDial}
                    strapOption={selectedStrap}
                  />
                </Motion.div>
              </AnimatePresence>
            </div>

            {/* Price under the watch */}
            <div className="cfg-preview__price-wrap">
              <AnimatePresence mode="wait">
                <Motion.p
                  key={totalPrice}
                  className="cfg-preview__price"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {formatPrice(totalPrice)}
                </Motion.p>
              </AnimatePresence>
              <p className="cfg-preview__price-note">Estimated price — includes selected options</p>
            </div>
          </div>

          {/* ── RIGHT: PANELS ── */}
          <div className="cfg-panels">

            {/* Panel tab selector */}
            <div className="cfg-tabs" role="tablist" aria-label="Configuration panels">
              {[
                { id: 'model', label: 'Model' },
                { id: 'case',  label: 'Case'  },
                { id: 'bezel', label: 'Bezel' },
                { id: 'dial',  label: 'Dial'  },
                { id: 'strap', label: 'Strap' },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={cn('cfg-tab', activePanel === tab.id && 'cfg-tab--active')}
                  onClick={() => setActivePanel(tab.id)}
                  role="tab"
                  aria-selected={activePanel === tab.id}
                  aria-controls={`cfg-panel-${tab.id}`}
                  id={`cfg-tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel content */}
            <div className="cfg-panel-content">

              {/* MODEL PANEL */}
              <AnimatePresence mode="wait">
                {activePanel === 'model' && (
                  <Motion.section
                    key="model"
                    id="cfg-panel-model"
                    role="tabpanel"
                    aria-labelledby="cfg-tab-model"
                    className="cfg-panel"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0  }}
                    exit={{    opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="cfg-panel__title">Watch Model</h2>
                    <p className="cfg-panel__desc">
                      Select the base 3D model architecture for your timepiece.
                    </p>
                    <div className="cfg-swatches" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      {MODEL_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          className={cn('cfg-swatch', selectedModel.id === opt.id && 'cfg-swatch--selected')}
                          onClick={() => setSelectedModel(opt)}
                          style={{ padding: '0.75rem', height: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                        >
                          <span className="cfg-swatch__label" style={{ position: 'static', opacity: 1, color: 'var(--color-text-primary)' }}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                    {/* Selected option detail */}
                    <div className="cfg-selection-detail">
                      <span className="cfg-selection-detail__name">{selectedModel.label}</span>
                      {selectedModel.price > 0 ? (
                        <span className="cfg-selection-detail__add">
                          +{formatPrice(selectedModel.price)}
                        </span>
                      ) : (
                        <span className="cfg-selection-detail__add">Included</span>
                      )}
                    </div>
                  </Motion.section>
                )}
              </AnimatePresence>

              {/* CASE PANEL */}
              <AnimatePresence mode="wait">
                {activePanel === 'case' && (
                  <Motion.section
                    key="case"
                    id="cfg-panel-case"
                    role="tabpanel"
                    aria-labelledby="cfg-tab-case"
                    className="cfg-panel"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0  }}
                    exit={{    opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="cfg-panel__title">Case Material</h2>
                    <p className="cfg-panel__desc">
                      The case is crafted from premium-grade materials. Each finish carries its own character.
                    </p>
                    <div className="cfg-swatches">
                      {CASE_OPTIONS.map(opt => (
                        <SwatchButton
                          key={opt.id}
                          color={opt.color === 'original' ? '#ccc' : opt.color}
                          label={opt.label}
                          selected={selectedCase.id === opt.id}
                          onClick={() => setSelectedCase(opt)}
                        />
                      ))}
                    </div>
                    {/* Selected option detail */}
                    <div className="cfg-selection-detail">
                      <span className="cfg-selection-detail__name">{selectedCase.label}</span>
                      {selectedCase.price > 0 && (
                        <span className="cfg-selection-detail__add">+{formatPrice(selectedCase.price)}</span>
                      )}
                    </div>
                  </Motion.section>
                )}
              </AnimatePresence>

              {/* BEZEL PANEL */}
              <AnimatePresence mode="wait">
                {activePanel === 'bezel' && (
                  <Motion.section
                    key="bezel"
                    id="cfg-panel-bezel"
                    role="tabpanel"
                    aria-labelledby="cfg-tab-bezel"
                    className="cfg-panel"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0  }}
                    exit={{    opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="cfg-panel__title">Bezel Insert</h2>
                    <p className="cfg-panel__desc">
                      The bezel frames the dial. Choose a finish that contrasts or complements the case.
                    </p>
                    <div className="cfg-swatches">
                      {BEZEL_OPTIONS.map(opt => (
                        <SwatchButton
                          key={opt.id}
                          color={opt.color === 'original' ? '#ccc' : opt.color}
                          label={opt.label}
                          selected={selectedBezel.id === opt.id}
                          onClick={() => setSelectedBezel(opt)}
                        />
                      ))}
                    </div>
                    {/* Selected option detail */}
                    <div className="cfg-selection-detail">
                      <span className="cfg-selection-detail__name">{selectedBezel.label}</span>
                      {selectedBezel.price > 0 && (
                        <span className="cfg-selection-detail__add">+{formatPrice(selectedBezel.price)}</span>
                      )}
                    </div>
                  </Motion.section>
                )}
              </AnimatePresence>

              {/* DIAL PANEL */}
              <AnimatePresence mode="wait">
                {activePanel === 'dial' && (
                  <Motion.section
                    key="dial"
                    id="cfg-panel-dial"
                    role="tabpanel"
                    aria-labelledby="cfg-tab-dial"
                    className="cfg-panel"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0  }}
                    exit={{    opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="cfg-panel__title">Dial Colour</h2>
                    <p className="cfg-panel__desc">
                      The dial is the soul of the watch. Choose the tone that speaks to you.
                    </p>
                    <div className="cfg-swatches">
                      {DIAL_OPTIONS.map(opt => (
                        <SwatchButton
                          key={opt.id}
                          color={opt.color === 'original' ? '#ccc' : opt.color}
                          label={opt.label}
                          selected={selectedDial.id === opt.id}
                          onClick={() => setSelectedDial(opt)}
                        />
                      ))}
                    </div>
                    <div className="cfg-selection-detail">
                      <span className="cfg-selection-detail__name">{selectedDial.label}</span>
                      {selectedDial.price > 0 && (
                        <span className="cfg-selection-detail__add">+{formatPrice(selectedDial.price)}</span>
                      )}
                    </div>
                  </Motion.section>
                )}
              </AnimatePresence>

              {/* STRAP PANEL */}
              <AnimatePresence mode="wait">
                {activePanel === 'strap' && (
                  <Motion.section
                    key="strap"
                    id="cfg-panel-strap"
                    role="tabpanel"
                    aria-labelledby="cfg-tab-strap"
                    className="cfg-panel"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0  }}
                    exit={{    opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h2 className="cfg-panel__title">Strap</h2>
                    <p className="cfg-panel__desc">
                      The strap completes the expression. Choose the material and texture that fits your wrist.
                    </p>
                    <div className="cfg-swatches">
                      {STRAP_OPTIONS.map(opt => (
                        <SwatchButton
                          key={opt.id}
                          color={opt.color === 'original' ? '#ccc' : opt.color}
                          label={opt.label}
                          selected={selectedStrap.id === opt.id}
                          onClick={() => setSelectedStrap(opt)}
                        />
                      ))}
                    </div>
                    <div className="cfg-selection-detail">
                      <span className="cfg-selection-detail__name">{selectedStrap.label}</span>
                      {selectedStrap.price > 0 && (
                        <span className="cfg-selection-detail__add">+{formatPrice(selectedStrap.price)}</span>
                      )}
                    </div>
                  </Motion.section>
                )}
              </AnimatePresence>
            </div>

            {/* ── SUMMARY + CTA ── */}
            <div className="cfg-summary">
              <div className="cfg-summary__lines">
                <div className="cfg-summary__line">
                  <span>Base model: {selectedModel.label}</span>
                  <span>{formatPrice(selectedModel.price)}</span>
                </div>
                {selectedCase.price > 0 && (
                  <div className="cfg-summary__line">
                    <span>{selectedCase.label} case</span>
                    <span>+{formatPrice(selectedCase.price)}</span>
                  </div>
                )}
                {selectedBezel.price > 0 && (
                  <div className="cfg-summary__line">
                    <span>{selectedBezel.label} bezel</span>
                    <span>+{formatPrice(selectedBezel.price)}</span>
                  </div>
                )}
                {selectedDial.price > 0 && (
                  <div className="cfg-summary__line">
                    <span>{selectedDial.label} dial</span>
                    <span>+{formatPrice(selectedDial.price)}</span>
                  </div>
                )}
                {selectedStrap.price > 0 && (
                  <div className="cfg-summary__line">
                    <span>{selectedStrap.label} strap</span>
                    <span>+{formatPrice(selectedStrap.price)}</span>
                  </div>
                )}
                <div className="cfg-summary__total">
                  <span>Total</span>
                  <AnimatePresence mode="wait">
                    <Motion.span
                      key={totalPrice}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{    opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {formatPrice(totalPrice)}
                    </Motion.span>
                  </AnimatePresence>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ── CONFIGURATION REQUEST FORM ── */}
        <section className="configurator-form">
          <div className="configurator-form__split">
            
            {/* ── LEFT PANEL (Summary) ── */}
            <div className="configurator-form__left">
              <div>
                <p className="configurator-form__left-eyebrow">Your Creation</p>
                <h2 className="configurator-form__left-title">Configuration Summary</h2>
                <p className="configurator-form__left-desc">
                  Review the details of your bespoke timepiece before submitting your request.
                </p>

                <div className="configurator-form__recap">
                  <div className="configurator-form__recap-item">
                    <span className="configurator-form__recap-key">Base Model</span>
                    <span className="configurator-form__recap-val">{selectedModel.label}</span>
                  </div>
                  <div className="configurator-form__recap-item">
                    <span className="configurator-form__recap-key">Case</span>
                    <span className="configurator-form__recap-val">{selectedCase.label}</span>
                  </div>
                  <div className="configurator-form__recap-item">
                    <span className="configurator-form__recap-key">Bezel</span>
                    <span className="configurator-form__recap-val">{selectedBezel.label}</span>
                  </div>
                  <div className="configurator-form__recap-item">
                    <span className="configurator-form__recap-key">Dial</span>
                    <span className="configurator-form__recap-val">{selectedDial.label}</span>
                  </div>
                  <div className="configurator-form__recap-item">
                    <span className="configurator-form__recap-key">Strap</span>
                    <span className="configurator-form__recap-val">{selectedStrap.label}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="configurator-form__total">
                  <span className="configurator-form__total-label">Estimated Total</span>
                  <span className="configurator-form__total-price">
                    <AnimatePresence mode="wait">
                      <Motion.span
                        key={totalPrice}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {formatPrice(totalPrice)}
                      </Motion.span>
                    </AnimatePresence>
                  </span>
                </div>
                <div className="configurator-form__brand-mark">Van Der Linde Geneva</div>
              </div>
            </div>

            {/* ── RIGHT PANEL (Form) ── */}
            <div className="configurator-form__right">
              <p className="configurator-form__right-eyebrow">Request a Quote</p>
              <h2 className="configurator-form__right-title">Submit Details</h2>
              <p className="configurator-form__right-desc">
                Share your information and a concierge will reach out within 2–3 business days to bring your vision to life.
              </p>

              {formSuccess ? (
                <Motion.div
                  className="configurator-form__success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="configurator-form__success-icon">✓</span>
                  <p>Your configuration has been submitted. We will be in touch within 2–3 business days.</p>
                  <p className="configurator-form__success-tag">Crafting Legacy Since 1874</p>
                </Motion.div>
              ) : (
                <form
                  id="configurator-request-form"
                  className="configurator-form__fields"
                  onSubmit={handleSubmit(async (values) => {
                    setFormSubmitting(true)
                    setFormError('')
                    try {
                      await configuratorService.submit({
                        name:  values.name,
                        email: values.email,
                        configuration: {
                          model:         selectedModel.label,
                          caseColor:     selectedCase.label,
                          bezelColor:    selectedBezel.label,
                          dialColor:     selectedDial.label,
                          strapMaterial: selectedStrap.label,
                          strapColor:    selectedStrap.color,
                          estimatedPrice: totalPrice,
                          notes:         values.notes || '',
                        },
                      })
                      setFormSuccess(true)
                    } catch (err) {
                      setFormError(err?.message || 'Something went wrong. Please try again.')
                    } finally {
                      setFormSubmitting(false)
                    }
                  })}
                >
                  <div className="configurator-form__row">
                    <div className="configurator-form__field">
                      <label htmlFor="cfg-req-name" className="configurator-form__label">Full Name</label>
                      <input
                        id="cfg-req-name"
                        type="text"
                        className={cn('configurator-form__input', errors.name && 'configurator-form__input--error')}
                        placeholder="Your name"
                        {...register('name')}
                      />
                      {errors.name && <span className="configurator-form__error">{errors.name.message}</span>}
                    </div>

                    <div className="configurator-form__field">
                      <label htmlFor="cfg-req-email" className="configurator-form__label">Email Address</label>
                      <input
                        id="cfg-req-email"
                        type="email"
                        className={cn('configurator-form__input', errors.email && 'configurator-form__input--error')}
                        placeholder="your@email.com"
                        {...register('email')}
                      />
                      {errors.email && <span className="configurator-form__error">{errors.email.message}</span>}
                    </div>
                  </div>

                  <div className="configurator-form__field">
                    <label htmlFor="cfg-req-notes" className="configurator-form__label">
                      Additional Notes <span className="configurator-form__optional">(optional)</span>
                    </label>
                    <textarea
                      id="cfg-req-notes"
                      className="configurator-form__textarea"
                      placeholder="Any special requests or details about your vision…"
                      rows={3}
                      {...register('notes')}
                    />
                  </div>

                  {formError && (
                    <p className="configurator-form__submit-error">{formError}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="configurator-form__submit"
                    isLoading={formSubmitting}
                    disabled={formSubmitting}
                  >
                    Submit Configuration
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  )
}
