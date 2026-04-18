import { useEffect, useState } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen({ isVisible = true }) {
  const [isActive, setIsActive] = useState(isVisible)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsActive(true)
      setIsExiting(false)
      return
    }

    if (!isActive) {
      return
    }

    setIsExiting(true)
    const timer = setTimeout(() => {
      setIsActive(false)
      setIsExiting(false)
    }, 220)

    return () => clearTimeout(timer)
  }, [isVisible, isActive])

  if (!isActive) return null

  return (
    <div className={`loading-screen${isExiting ? ' loading-screen--exit' : ''}`} aria-hidden="true">
      <div className="loading-screen__content" aria-hidden="true">
        <div className="loading-screen__watch">
          <div className="loading-screen__glow" />
          <div className="loading-screen__face" />
          <div className="loading-screen__hand loading-screen__hand--hour" />
          <div className="loading-screen__hand loading-screen__hand--minute" />
          <div className="loading-screen__pivot" />
        </div>
        <div className="loading-screen__brand">
          <img className="loading-screen__logo" src="/Logo2.png" alt="" />
          <p className="loading-screen__name">Van Der Linde</p>
        </div>
      </div>
    </div>
  )
}
