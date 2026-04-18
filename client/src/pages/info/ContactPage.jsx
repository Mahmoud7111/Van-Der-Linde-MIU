import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import Button from '@/components/common/Button'
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'
import './ContactPage.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('idle') // idle, submitting, success

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('submitting')
    // Simulate an API call
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1500)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  }

  return (
    <div className="contact-page">
      <header className="contact-page__header">
        <Motion.h1 
          className="contact-page__title"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Contact Us
        </Motion.h1>
        <Motion.p 
          className="contact-page__subtitle"
          initial="hidden"
          animate="visible"
          variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.2 } } }}
        >
          We are here to assist you. Reach out to our concierges for any inquiries regarding our collections, services, or your order.
        </Motion.p>
      </header>

      <div className="contact-page__content">
        <Motion.div 
          className="contact-info"
          initial="hidden"
          animate="visible"
          variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.4 } } }}
        >
          <h2 className="contact-info__heading">Our Atelier</h2>
          
          <div className="contact-info__item">
            <FiMapPin className="contact-info__icon" />
            <div>
              <h3>Address</h3>
              <p>12 Rue du Rhône<br/>1204 Geneva, Switzerland</p>
            </div>
          </div>

          <div className="contact-info__item">
            <FiPhone className="contact-info__icon" />
            <div>
              <h3>Telephone</h3>
              <p>+41 22 312 45 67</p>
            </div>
          </div>

          <div className="contact-info__item">
            <FiMail className="contact-info__icon" />
            <div>
              <h3>Email</h3>
              <p>concierge@vanderlinde.ch</p>
            </div>
          </div>

          <div className="contact-info__item">
            <FiClock className="contact-info__icon" />
            <div>
              <h3>Opening Hours</h3>
              <p>Monday - Friday: 10:00 - 18:30<br/>Saturday: 10:00 - 17:00<br/>Sunday: Closed</p>
            </div>
          </div>
        </Motion.div>

        <Motion.div 
          className="contact-form-container"
          initial="hidden"
          animate="visible"
          variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.6 } } }}
        >
          <h2 className="contact-form__heading">Send a Message</h2>
          
          {status === 'success' ? (
            <div className="contact-form__success">
              <h3>Thank you for reaching out.</h3>
              <p>Our concierge team will reply to you within 24 hours.</p>
              <Button variant="primary" onClick={() => setStatus('idle')}>Send Another Message</Button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Information">Product Information</option>
                  <option value="After-Sales Service">After-Sales Service</option>
                  <option value="Press & Media">Press & Media</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  rows="5"
                  placeholder="How can we assist you today?"
                ></textarea>
              </div>

              <Button type="submit" variant="primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </Motion.div>
      </div>
    </div>
  )
}
