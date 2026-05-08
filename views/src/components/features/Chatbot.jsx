import React, { useState, useRef, useEffect } from 'react'
import ChatbotIcon from './ChatbotIcon'
import './Chatbot.css'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  function handleSend(e) {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((msgs) => [...msgs, { from: 'user', text: input }])
    setInput('')
    // Simulate bot reply
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: "I'm just a demo bot! (Integrate your backend here)" }
      ])
    }, 800)
  }

  return (
    <>
      <button
        className={`chatbot-fab${open ? ' chatbot-fab--open' : ''}`}
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
        onClick={() => setOpen((v) => !v)}
      >
        <ChatbotIcon size={32} />
      </button>
      {open && (
        <div className="chatbot-window" role="dialog" aria-modal="true">
          <div className="chatbot-header">
            <ChatbotIcon size={28} />
            <span className="chatbot-title">Chat with us</span>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chatbot">×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${msg.from}`}>{msg.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form className="chatbot-input-row" onSubmit={handleSend} autoComplete="off">
            <input
              className="chatbot-input"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              aria-label="Type your message"
            />
            <button className="chatbot-send" type="submit" aria-label="Send message">➤</button>
          </form>
        </div>
      )}
    </>
  )
}
