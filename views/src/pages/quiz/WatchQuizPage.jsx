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
import { watchService } from '@/services/watchService'
import { resolveWatchProductImage } from '@/utils/watchImageResolver'
import './WatchQuizPage.css'

const QUESTIONS = [
  {
    id: 'category',
    question: "What is the primary occasion for this timepiece?",
    options: [
      { label: 'Daily Wear', value: 'classic', icon: <FiBriefcase /> },
      { label: 'Formal Events', value: 'luxury', icon: <FiAward /> },
      { label: 'Active Lifestyle', value: 'sport', icon: <FiActivity /> },
      { label: 'Tech & Lifestyle', value: 'smart', icon: <FiCpu /> }
    ]
  },
  {
    id: 'priceRange',
    question: "What is your preferred price range?",
    options: [
      { label: 'Under $1,000', value: 'low', icon: <FiDollarSign /> },
      { label: '$1,000 - $2,000', value: 'mid', icon: <><FiDollarSign /><FiDollarSign /></> },
      { label: '$2,000+', value: 'high', icon: <><FiDollarSign /><FiDollarSign /><FiDollarSign /></> }
    ]
  },
  {
    id: 'style',
    question: "Which style resonates with you most?",
    options: [
      { label: 'Minimalist & Slim', value: 'minimalist', icon: <FiMinus /> },
      { label: 'Bold & Technical', value: 'bold', icon: <FiZap /> },
      { label: 'Vintage Inspired', value: 'vintage', icon: <FiClock /> }
    ]
  }
]

export default function WatchQuizPage() {
  const { formatPrice } = useCurrency()
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
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
              variants={fadeInUp}
            >
              <h1 className="quiz-welcome__title">Find Your Perfect <br /> Timepiece</h1>
              <p className="quiz-welcome__subtitle">
                Answer a few questions about your style and preferences, and we'll curate a selection of watches tailored specifically for you.
              </p>
              <Button onClick={handleStart} variant="primary" size="lg">Start the Quiz</Button>
            </Motion.div>
          )}

          {step > 0 && step <= QUESTIONS.length && (
            <Motion.div 
              key={`question-${step}`}
              className="quiz-step"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInUp}
            >
              <div className="quiz-step__progress">
                <div className="progress-bar">
                  <div 
                    className="progress-bar__fill" 
                    style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">Step {step} of {QUESTIONS.length}</span>
              </div>

              <h2 className="quiz-step__question">{QUESTIONS[step - 1].question}</h2>
              
              <div className="quiz-options">
                {QUESTIONS[step - 1].options.map((option) => (
                  <button
                    key={option.value}
                    className="quiz-option"
                    onClick={() => handleAnswer(QUESTIONS[step - 1].id, option.value)}
                  >
                    <span className="quiz-option__icon">{option.icon}</span>
                    <span className="quiz-option__label">{option.label}</span>
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
              variants={fadeInUp}
            >
              <h2 className="quiz-results__title">Our Recommendations</h2>
              <p className="quiz-results__subtitle">Based on your preferences, we think you'll love these timepieces.</p>
              
              {loading ? (
                <div className="loader">Analyzing your style...</div>
              ) : (
                <div className="results-grid">
                  {results.map((watch, index) => {
                    const watchId = watch?._id || watch?.id

                    return (
                    <div key={watchId || `${watch?.name || 'watch'}-${index}`} className="result-card">
                      <img 
                        src={resolveWatchProductImage(watch?.images?.[0] || watch?.image)} 
                        alt={watch?.name || 'Watch'} 
                        className="result-card__image" 
                      />
                      <h3 className="result-card__name">{watch?.name || 'Van Der Linde Watch'}</h3>
                      <span className="result-card__price">{formatPrice(Number(watch?.price) || 0)}</span>
                      <Button to={watchId ? `/watch/${watchId}` : '/shop'} variant="outline" size="sm">View Details</Button>
                    </div>
                  )})}
                </div>
              )}
              
              <div className="quiz-navigation">
                <Button onClick={handleRestart} variant="outline">Restart Quiz</Button>
                <Button to="/shop" variant="primary">Shop All Collection</Button>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
