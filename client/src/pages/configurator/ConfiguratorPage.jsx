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
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useCurrency } from '@/context/CurrencyContext'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import Watch3DModel from '@/components/configurator/Watch3DModel'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'
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
  const { dispatch } = useCart()
  const { formatPrice } = useCurrency()

  // Active selections — defaults to first option in each group
  const [selectedCase,  setSelectedCase]  = useState(CASE_OPTIONS[0])
  const [selectedBezel, setSelectedBezel] = useState(BEZEL_OPTIONS[0])
  const [selectedDial,  setSelectedDial]  = useState(DIAL_OPTIONS[0])
  const [selectedStrap, setSelectedStrap] = useState(STRAP_OPTIONS[0])
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0])

  // Active config panel tab
  const [activePanel, setActivePanel] = useState('model')

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

  // Summary label for the configured watch
  const watchName = `Van Der Linde — ${selectedModel.label} / ${selectedCase.label} / ${selectedDial.label} / ${selectedStrap.label}`

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD',
      payload: {
        _id: `custom-${selectedCase.id}-${selectedDial.id}-${selectedStrap.id}`,
        name: watchName,
        price: totalPrice,
        stock: 1,
        quantity: 1,
        images: [],
        category: 'luxury',
        // Custom flag so admin/checkout can identify configured items
        isConfigured: true,
        configuration: {
          model: selectedModel.label,
          case:  selectedCase.label,
          bezel: selectedBezel.label,
          dial:  selectedDial.label,
          strap: selectedStrap.label,
        },
      },
    })
    toast.success('Added to cart')
  }

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

              <Button
                variant="primary"
                size="lg"
                className="cfg-summary__cta"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <p className="cfg-summary__note">
                Complimentary delivery · 30-day returns · Certificate of authenticity
              </p>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  )
}