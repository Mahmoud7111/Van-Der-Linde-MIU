import { useState, useEffect, useCallback } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FiChevronDown,
  FiUser,
  FiUsers,
  FiTag,
  FiActivity,
  FiBriefcase,
  FiAward,
  FiCpu,
  FiCheckCircle,
  FiX
} from 'react-icons/fi'
import { useCurrency } from '@/context/CurrencyContext'
import { watchService } from '@/services/watchService'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import revealImg from '@/assets/quiz-reveal-watch.png'
import './WatchQuizPage.css'

/* Category icons map */
const CATEGORY_ICONS = {
  dress:   <FiAward />,
  sport:   <FiActivity />,
  dive:    <FiActivity />,
  pilot:   <FiBriefcase />,
  luxury:  <FiAward />,
  casual:  <FiBriefcase />,
  classic: <FiBriefcase />,
  smart:   <FiCpu />,
}

/* Animation variants */
const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

export default function WatchQuizPage() {
  const { formatPrice } = useCurrency()
  const [step, setStep]         = useState(0)   // 0=welcome, 1..N=questions, N+1=reveal, N+2=results
  const [answers, setAnswers]   = useState({})
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [questions, setQuestions] = useState([])
  const [watches, setWatches]   = useState([])
  const [modal, setModal]       = useState(null) // selected watch for modal

  /* ── Load DB watches & build questions ── */
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await watchService.getAll()
        const list = Array.isArray(raw) ? raw : []
        setWatches(list)

        const genders    = [...new Set(list.map(w => w.gender).filter(Boolean))]
        const categories = [...new Set(list.map(w => w.category).filter(Boolean))]
        const brands     = [...new Set(list.map(w => w.brand?.name).filter(Boolean))]

        const qs = []

        if (genders.length > 0) {
          qs.push({
            id: 'gender',
            question: 'WHAT IS YOUR GENDER',
            hint: 'Select Only 1',
            layout: 'tiles',
            options: genders.map(g => ({
              label: g === 'unisex' ? 'GENDER NEUTRAL' : g.toUpperCase(),
              value: g,
              icon: g === 'unisex' ? <FiUsers /> : <FiUser />,
            })),
          })
        }

        if (categories.length > 0) {
          qs.push({
            id: 'category',
            question: 'ANY FAVORITE WATCH STYLE?',
            hint: 'Select 1',
            layout: 'grid',
            options: categories.map(c => ({
              label: c.toUpperCase(),
              value: c,
              icon: CATEGORY_ICONS[c] || <FiActivity />,
            })),
          })
        }

        if (brands.length > 0) {
          qs.push({
            id: 'brand',
            question: 'ANY FAVORITE BRAND?',
            hint: 'Select 1',
            layout: 'tiles',
            options: brands.map(b => ({
              label: b.toUpperCase(),
              value: b,
              icon: <FiTag />,
            })),
          })
        }

        /* Fallback if DB is empty */
        if (qs.length === 0) {
          qs.push({
            id: 'category',
            question: 'WHAT STYLE SUITS YOU?',
            hint: 'Select 1',
            layout: 'tiles',
            options: [
              { label: 'CLASSIC', value: 'classic', icon: <FiBriefcase /> },
              { label: 'SPORT',   value: 'sport',   icon: <FiActivity /> },
              { label: 'LUXURY',  value: 'luxury',  icon: <FiAward /> },
              { label: 'SMART',   value: 'smart',   icon: <FiCpu /> },
            ],
          })
        }

        setQuestions(qs)
      } catch (err) {
        console.error('Quiz load error:', err)
      }
    }

    load()
  }, [])

  /* ── Scoring ── */
  const computeResults = useCallback((finalAnswers, watchList) => {
    const scored = watchList.map(w => {
      let score = 0
      if (finalAnswers.gender) {
        if (w.gender === finalAnswers.gender) score += 15
        else if (w.gender === 'unisex')        score += 5
      }
      if (finalAnswers.category && w.category === finalAnswers.category) score += 15
      if (finalAnswers.brand    && w.brand?.name === finalAnswers.brand)  score += 10
      return { ...w, _quizScore: score }
    })
    const top = scored
      .filter(w => w._quizScore > 0)
      .sort((a, b) => b._quizScore - a._quizScore)
      .slice(0, 3)
    return top.length > 0 ? top : watchList.slice(0, 3)
  }, [])

  /* ── Handlers ── */
  const handleStart = () => questions.length > 0 && setStep(1)

  const handleAnswer = (qId, value) => {
    const next = { ...answers, [qId]: value }
    setAnswers(next)
    if (step < questions.length) {
      setStep(s => s + 1)
    } else {
      /* Move to reveal/loading screen */
      setLoading(true)
      setStep(questions.length + 1)
      setTimeout(() => {
        setResults(computeResults(next, watches))
        setLoading(false)
      }, 1200)
    }
  }

  const handleReveal = () => setStep(questions.length + 2)

  const handleRestart = () => {
    setStep(0)
    setAnswers({})
    setResults([])
    setModal(null)
  }

  const progress = questions.length > 0
    ? (Math.min(step, questions.length) / questions.length) * 100
    : 0

  const currentQ = step >= 1 && step <= questions.length ? questions[step - 1] : null

  return (
    <div className="watch-quiz-page">
      {/* Thin top progress bar */}
      {step > 0 && step <= questions.length && (
        <div className="quiz-progress-bar">
          <div className="quiz-progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* ── Step 0: Welcome ── */}
        {step === 0 && (
          <Motion.div
            key="welcome"
            className="quiz-welcome"
            variants={fade} initial="hidden" animate="visible" exit="exit"
          >
            <h1 className="quiz-welcome__title">
              FIRST, WE'LL NEED AN<br />INTRODUCTION FROM YOU.
            </h1>
            <button
              className="quiz-welcome__chevron-btn"
              onClick={handleStart}
              disabled={questions.length === 0}
              aria-label="Start quiz"
            >
              <FiChevronDown />
            </button>
          </Motion.div>
        )}

        {/* ── Steps 1-N: Questions ── */}
        {currentQ && (
          <Motion.div
            key={`q-${step}`}
            variants={fade} initial="hidden" animate="visible" exit="exit"
            style={{ width: '100%' }}
          >
            {currentQ.layout === 'tiles' ? (
              /* Split layout — left text, right stacked tiles */
              <div className="quiz-split">
                <div className="quiz-split__left">
                  <p className="quiz-split__label">Step {step} / {questions.length}</p>
                  <h2 className="quiz-split__question">{currentQ.question}</h2>
                  <div className="quiz-split__meta">
                    <span className="quiz-select-hint">{currentQ.hint}</span>
                  </div>
                </div>
                <div className="quiz-split__right">
                  {currentQ.options.map(opt => (
                    <button
                      key={opt.value}
                      className={`quiz-option-tile ${answers[currentQ.id] === opt.value ? 'quiz-option-tile--selected' : ''}`}
                      onClick={() => handleAnswer(currentQ.id, opt.value)}
                    >
                      <span className="quiz-option-tile__icon-wrap">{opt.icon}</span>
                      <span className="quiz-option-tile__label">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Grid layout — centered title + 2-col grid */
              <div className="quiz-grid-screen">
                <div className="quiz-grid-screen__header">
                  <h2 className="quiz-grid-screen__title">
                    ANY <span>FAVORITE</span> WATCH STYLE?
                  </h2>
                  <div className="quiz-grid-screen__meta">
                    <span className="quiz-select-hint">{currentQ.hint}</span>
                  </div>
                </div>
                <div className="quiz-grid-options">
                  {currentQ.options.map(opt => (
                    <button
                      key={opt.value}
                      className={`quiz-grid-cell ${answers[currentQ.id] === opt.value ? 'quiz-grid-cell--selected' : ''}`}
                      onClick={() => handleAnswer(currentQ.id, opt.value)}
                    >
                      <span className="quiz-grid-cell__label">
                        {opt.label}
                        {answers[currentQ.id] === opt.value && (
                          <span className="quiz-grid-cell__check">✓</span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Motion.div>
        )}

        {/* ── Reveal / Loading Screen ── */}
        {step === questions.length + 1 && (
          <Motion.div
            key="reveal"
            style={{ width: '100%' }}
            variants={fade} initial="hidden" animate="visible" exit="exit"
          >
            <div className="quiz-reveal-screen">
              <img src={revealImg} alt="Luxury watch" className="quiz-reveal-screen__image" />
              <div className="quiz-reveal-screen__right">
                {loading ? (
                  <div className="quiz-loader">
                    <p>PREPARING YOUR PERSONALISED WATCH RECOMMENDATIONS...</p>
                  </div>
                ) : (
                  <>
                    <p className="quiz-reveal-screen__title">
                      PREPARING YOUR PERSONALISED WATCH<br />RECOMMENDATIONS...
                    </p>
                    <ul className="quiz-reveal-checklist">
                      <li><FiCheckCircle /> Your style profile decoded</li>
                      <li><FiCheckCircle /> Your category analysis</li>
                      <li><FiCheckCircle /> Your personalised watch selection</li>
                    </ul>
                    <button className="quiz-reveal-screen__btn" onClick={handleReveal}>
                      REVEAL MY RESULT
                    </button>
                  </>
                )}
              </div>
            </div>
          </Motion.div>
        )}

        {/* ── Results Screen ── */}
        {step === questions.length + 2 && (
          <Motion.div
            key="results"
            className="quiz-results-screen"
            variants={fade} initial="hidden" animate="visible" exit="exit"
          >
            <h2 className="quiz-results-screen__title">OUR RECOMMENDATIONS</h2>
            <p className="quiz-results-screen__sub">Based on your preferences, we curated these timepieces for you.</p>

            <div className="quiz-results-grid">
              {results.map((watch, i) => {
                const wId = watch?._id || watch?.id
                return (
                  <div
                    key={wId || i}
                    className="quiz-result-card"
                    onClick={() => setModal(watch)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setModal(watch)}
                  >
                    <img
                      src={resolveWatchProductImage(watch?.images?.[0] || watch?.image)}
                      alt={watch?.name}
                      className="quiz-result-card__img"
                    />
                    <span className="quiz-result-card__brand">{watch?.brand?.name || ''}</span>
                    <h3 className="quiz-result-card__name">{watch?.name}</h3>
                    <span className="quiz-result-card__price">{formatPrice(Number(watch?.price) || 0)}</span>
                  </div>
                )
              })}
            </div>

            <div className="quiz-results-nav">
              <button onClick={handleRestart} style={{
                background: 'none',
                border: '1px solid #c8b49a',
                padding: '0.8rem 2rem',
                letterSpacing: '0.14em',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                cursor: 'pointer',
                color: '#3a2e22',
              }}>
                RETAKE QUIZ
              </button>
              <Link to="/shop" style={{
                display: 'inline-block',
                background: '#5a5a52',
                color: '#fff',
                padding: '0.8rem 2rem',
                textDecoration: 'none',
                letterSpacing: '0.14em',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
              }}>
                SHOP ALL COLLECTION
              </Link>
            </div>
          </Motion.div>
        )}

      </AnimatePresence>

      {/* ── Product Modal ── */}
      <AnimatePresence>
        {modal && (
          <Motion.div
            className="quiz-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <Motion.div
              className="quiz-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="quiz-modal__close" onClick={() => setModal(null)} aria-label="Close">
                <FiX />
              </button>

              <div className="quiz-modal__img-wrap">
                <img
                  src={resolveWatchProductImage(modal?.images?.[0] || modal?.image)}
                  alt={modal?.name}
                  className="quiz-modal__img"
                />
              </div>

              <h2 className="quiz-modal__name">{modal?.name}</h2>
              <p className="quiz-modal__desc">{modal?.description || 'A refined timepiece crafted for the discerning collector.'}</p>
              <span className="quiz-modal__price">{formatPrice(Number(modal?.price) || 0)}</span>

              <Link
                to={`/watch/${modal?._id || modal?.id}`}
                className="quiz-modal__btn"
                onClick={() => setModal(null)}
              >
                Shop Now
              </Link>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
