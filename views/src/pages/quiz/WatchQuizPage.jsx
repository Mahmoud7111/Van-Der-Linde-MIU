import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'
import { 
  FiBriefcase, 
  FiAward, 
  FiActivity, 
  FiCpu, 
  FiDollarSign, 
  FiMinus, 
  FiZap, 
  FiClock 
} from 'react-icons/fi'
import { useCurrency } from '@/context/CurrencyContext'
import { useLanguage } from '@/context/LanguageContext'
import { watchService } from '@/services/watchService'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import './WatchQuizPage.css'

const QUESTIONS = [
  {
    id: 'category',
    questionKey: 'quiz.qOccasion',
    options: [
      { labelKey: 'quiz.dailyWear', value: 'classic', icon: <FiBriefcase /> },
      { labelKey: 'quiz.formalEvents', value: 'luxury', icon: <FiAward /> },
      { labelKey: 'quiz.activeLifestyle', value: 'sport', icon: <FiActivity /> },
      { labelKey: 'quiz.techLifestyle', value: 'smart', icon: <FiCpu /> }
    ]
  },
  {
    id: 'priceRange',
    questionKey: 'quiz.qPrice',
    options: [
      { labelKey: 'quiz.under1000', value: 'low', icon: <FiDollarSign /> },
      { labelKey: 'quiz.1000to2000', value: 'mid', icon: <><FiDollarSign /><FiDollarSign /></> },
      { labelKey: 'quiz.2000plus', value: 'high', icon: <><FiDollarSign /><FiDollarSign /><FiDollarSign /></> }
    ]
  },
  {
    id: 'style',
    questionKey: 'quiz.qStyle',
    options: [
      { labelKey: 'quiz.minimalist', value: 'minimalist', icon: <FiMinus /> },
      { labelKey: 'quiz.bold', value: 'bold', icon: <FiZap /> },
      { labelKey: 'quiz.vintage', value: 'vintage', icon: <FiClock /> }
    ]
  }
]

export default function WatchQuizPage() {
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const [step, setStep] = useState(0) // 0: welcome, 1-N: questions, N+1: results
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleStart = () => setStep(1)

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    
    if (step < QUESTIONS.length) {
      setStep(step + 1)
    } else {
      showResults(newAnswers)
    }
  }

  const showResults = async (finalAnswers) => {
    setLoading(true)
    setStep(QUESTIONS.length + 1)
    
    try {
      const allWatches = await watchService.getAll()
      const watchList = Array.isArray(allWatches) ? allWatches : []
      
      // Advanced scoring logic for better matching
      const scoredWatches = watchList.map((watch) => {
        let score = 0
        
        // 1. Category match (High weight)
        if (finalAnswers.category && watch?.category === finalAnswers.category) {
          score += 10
        }
        
        // 2. Price match (Medium weight)
        const price = Number(watch?.price) || 0
        if (finalAnswers.priceRange === 'low' && price < 1000) score += 5
        else if (finalAnswers.priceRange === 'mid' && price >= 1000 && price <= 2000) score += 5
        else if (finalAnswers.priceRange === 'high' && price > 2000) score += 5
        
        // 3. Style match (Medium weight)
        const desc = String(watch?.description || '').toLowerCase()
        const name = String(watch?.name || '').toLowerCase()
        const style = finalAnswers.style
        
        if (style === 'minimalist') {
          if (desc.includes('minimalist') || desc.includes('slim') || desc.includes('clean') || name.includes('slim')) {
            score += 7
          }
        } else if (style === 'bold') {
          if (desc.includes('bold') || desc.includes('technical') || desc.includes('chronograph') || desc.includes('pro') || name.includes('pro')) {
            score += 7
          }
        } else if (style === 'vintage') {
          if (desc.includes('vintage') || desc.includes('heritage') || desc.includes('classic') || desc.includes('mid-century') || name.includes('heritage')) {
            score += 7
          }
        }
        
        return { ...watch, quizScore: score }
      })

      // Sort by score and take top 3
      const filtered = scoredWatches
        .filter((watch) => watch.quizScore > 0)
        .sort((a, b) => b.quizScore - a.quizScore)
        .slice(0, 3)

      setResults(filtered.length > 0 ? filtered : watchList.slice(0, 3))
    } catch (error) {
      console.error("Failed to fetch results", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers({})
    setResults([])
  }

  const fadeInDown = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
  }

  return (
    <div className="watch-quiz-page">
      <div className="quiz-container">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <Motion.div 
              key="welcome"
              className="quiz-welcome"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInDown}
            >
              <h1 className="quiz-welcome__title">{t('quiz.titleLine1')} <br /> {t('quiz.titleLine2')}</h1>
              <p className="quiz-welcome__subtitle">
                {t('quiz.subtitle')}
              </p>
              <Button onClick={handleStart} variant="primary" size="lg">{t('quiz.start')}</Button>
            </Motion.div>
          )}

          {step > 0 && step <= QUESTIONS.length && (
            <Motion.div 
              key={`question-${step}`}
              className="quiz-step"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInDown}
            >
              <div className="quiz-step__progress">
                <div className="progress-bar">
                  <div 
                    className="progress-bar__fill" 
                    style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">{t('quiz.step', { current: step, total: QUESTIONS.length })}</span>
              </div>

              <h2 className="quiz-step__question">{t(QUESTIONS[step - 1].questionKey)}</h2>
              
              <div className="quiz-options">
                {QUESTIONS[step - 1].options.map((option) => (
                  <button
                    key={option.value}
                    className="quiz-option"
                    onClick={() => handleAnswer(QUESTIONS[step - 1].id, option.value)}
                  >
                    <span className="quiz-option__icon">{option.icon}</span>
                    <span className="quiz-option__label">{t(option.labelKey)}</span>
                  </button>
                ))}
              </div>
            </Motion.div>
          )}

          {step > QUESTIONS.length && (
            <Motion.div 
              key="results"
              className="quiz-results"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInDown}
            >
              <h2 className="quiz-results__title">{t('quiz.recommendations')}</h2>
              <p className="quiz-results__subtitle">{t('quiz.resultsSubtitle')}</p>
              
              {loading ? (
                <div className="loader">{t('quiz.loading')}</div>
              ) : (
                <div className="results-grid">
                  {results.map((watch, index) => {
                    const watchId = watch?._id || watch?.id

                    return (
                    <div key={watchId || `${watch?.name || 'watch'}-${index}`} className="result-card">
                      <img 
                        src={resolveWatchProductImage(watch?.images?.[0] || watch?.image)} 
                        alt={watch?.name || t('product.watchFallbackAlt')} 
                        className="result-card__image" 
                      />
                      <h3 className="result-card__name">{watch?.name || t('product.watchFallbackName')}</h3>
                      <span className="result-card__price">{formatPrice(Number(watch?.price) || 0)}</span>
                      <Button to={watchId ? `/watch/${watchId}` : '/shop'} variant="outline" size="sm">{t('quiz.viewDetails')}</Button>
                    </div>
                  )})}
                </div>
              )}
              
              <div className="quiz-navigation">
                <Button onClick={handleRestart} variant="outline">{t('quiz.restart')}</Button>
                <Button to="/shop" variant="primary">{t('quiz.shopAll')}</Button>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
