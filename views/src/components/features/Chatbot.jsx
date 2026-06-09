import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { chatbotService } from '@/services/chatbotService'
import ChatbotIcon from './ChatbotIcon'
import './Chatbot.css'

export default function Chatbot() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I\'m the Van Der Linde Assistant. How can I help you find your perfect timepiece today? ⌚' }
  ])
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    // Append user message immediately
    setMessages(prev => [...prev, { from: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const reply = await chatbotService.sendMessage(text, location.pathname)

      setMessages(prev => [...prev, { from: 'bot', text: reply }])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: err.message || 'Sorry, I encountered an issue. Please try again in a moment.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        className={`chatbot-fab${open ? ' chatbot-fab--open' : ''}`}
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
        onClick={() => setOpen(v => !v)}
      >
        <ChatbotIcon size={32} />
      </button>

      {open && (
        <div className="chatbot-window" role="dialog" aria-modal="true">
          <div className="chatbot-header">
            <ChatbotIcon size={28} />
            <span className="chatbot-title">Van Der Linde Assistant</span>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chatbot">×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${msg.from}`}>{msg.text}</div>
            ))}
            {loading && (
              <div className="chatbot-msg chatbot-msg--bot chatbot-msg--typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chatbot-input-row" onSubmit={handleSend} autoComplete="off">
            <input
              className="chatbot-input"
              type="text"
              placeholder="Ask about our watches…"
              value={input}
              onChange={e => setInput(e.target.value)}
              aria-label="Type your message"
              disabled={loading}
            />
            <button className="chatbot-send" type="submit" aria-label="Send message" disabled={loading}>➤</button>
          </form>
        </div>
      )}
    </>
  )
}
