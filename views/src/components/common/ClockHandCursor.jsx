// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion as Motion } from 'framer-motion'
import './ClockHandCursor.css'

export default function ClockHandCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [angleDeg, setAngleDeg] = useState(0)
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [reduced, setReduced] = useState(false)

  const lastRef = useRef({ x: 0, y: 0 })

  const handleMove = useCallback((e) => {
    const dx = e.clientX - lastRef.current.x
    const dy = e.clientY - lastRef.current.y
    if (dx || dy) {
      const nextAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
      setAngleDeg(nextAngleDeg)
    }
    lastRef.current = { x: e.clientX, y: e.clientY }
    setPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleDown = () => setIsClicking(true)
  const handleUp = () => setIsClicking(false)

  const handleOver = useCallback((e) => {
    const target = e.target
    if (target.matches('a, button, input, [data-hover="true"]')) {
      setIsHovering(true)
    }
  }, [])

  const handleOut = useCallback(() => setIsHovering(false), [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touch = window.matchMedia('(pointer: coarse)')
    const update = () => setReduced(mq.matches || touch.matches)

    update()
    mq.addEventListener('change', update)
    touch.addEventListener('change', update)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('mouseover', handleOver)
    window.addEventListener('mouseout', handleOut)

    return () => {
      mq.removeEventListener('change', update)
      touch.removeEventListener('change', update)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mouseout', handleOut)
    }
  }, [handleMove, handleOver, handleOut])

  if (reduced) return null

  const hourDeg = angleDeg * 0.5

  return (
    <div className="clock-cursor" aria-hidden="true">
      <Motion.div
        className="clock-cursor__center"
        style={{ translateX: '-50%', translateY: '-50%' }}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', damping: 24, stiffness: 320, mass: 0.6 }}
      >
        <Motion.div
          className="clock-cursor__glow"
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{
            scale: isHovering ? 1.3 : 1,
            opacity: isClicking ? 0.35 : isHovering ? 0.7 : 0.45,
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.8 }}
        />
        <Motion.div
          className="clock-cursor__face"
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{
            scale: isHovering ? 1.08 : 1,
            opacity: isClicking ? 0.35 : isHovering ? 0.8 : 0.6,
          }}
          transition={{ type: 'spring', damping: 28, stiffness: 240, mass: 0.7 }}
        />
        <Motion.div
          className="clock-cursor__hand clock-cursor__hand--minute"
          style={{ translateX: '0%', translateY: '-50%' }}
          animate={{
            rotate: angleDeg,
            scaleX: isHovering ? 1.15 : 1,
            scaleY: isHovering ? 1.1 : 1,
          }}
          transition={{ type: 'spring', damping: 22, stiffness: 260, mass: 0.6 }}
        />
        <Motion.div
          className="clock-cursor__hand clock-cursor__hand--hour"
          style={{ translateX: '0%', translateY: '-50%' }}
          animate={{
            rotate: hourDeg,
            scaleX: isHovering ? 1.1 : 1,
            scaleY: isHovering ? 1.05 : 1,
          }}
          transition={{ type: 'spring', damping: 26, stiffness: 220, mass: 0.7 }}
        />
        <Motion.div
          className="clock-cursor__pivot"
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{
            scale: isClicking ? 0.8 : 1,
            opacity: isHovering ? 0.95 : 0.7,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.5 }}
        />
      </Motion.div>
    </div>
  )
}
