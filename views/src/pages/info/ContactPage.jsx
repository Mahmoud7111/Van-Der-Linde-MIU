import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import Button from '@/components/common/Button'
import { useLanguage } from '@/context/LanguageContext'
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'
import './ContactPage.css'

export default function ContactPage() {
  const { t } = useLanguage()
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
          {t('contact.title')}
        </Motion.h1>
        <Motion.p 
          className="contact-page__subtitle"
          initial="hidden"
          animate="visible"
          variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.2 } } }}
        >
          {t('contact.subtitle')}
        </Motion.p>
      </header>

      <div className="contact-page__content">
        <Motion.div 
          className="contact-info"
          initial="hidden"
          animate="visible"
          variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.4 } } }}
        >
          <h2 className="contact-info__heading">{t('contact.atelier')}</h2>
          
          <div className="contact-info__item">
            <FiMapPin className="contact-info__icon" />
            <div>
              <h3>{t('contact.address')}</h3>
              <p>12 Rue du Rhône<br/>1204 Geneva, Switzerland</p>
            </div>
          </div>

          <div className="contact-info__item">
            <FiPhone className="contact-info__icon" />
            <div>
              <h3>{t('contact.telephone')}</h3>
              <p>+41 22 312 45 67</p>
            </div>
          </div>

          <div className="contact-info__item">
            <FiMail className="contact-info__icon" />
            <div>
              <h3>{t('checkout.email')}</h3>
              <p>concierge@vanderlinde.ch</p>
            </div>
          </div>

          <div className="contact-info__item">
            <FiClock className="contact-info__icon" />
            <div>
              <h3>{t('contact.openingHours')}</h3>
              <p>{t('contact.hours').split('\n').map((line) => <span key={line}>{line}<br /></span>)}</p>
            </div>
          </div>
        </Motion.div>

        <Motion.div 
          className="contact-form-container"
          initial="hidden"
          animate="visible"
          variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.6 } } }}
        >
          <h2 className="contact-form__heading">{t('contact.sendMessage')}</h2>
          
          {status === 'success' ? (
            <div className="contact-form__success">
              <h3>{t('contact.thankYou')}</h3>
              <p>{t('contact.reply')}</p>
              <Button variant="primary" onClick={() => setStatus('idle')}>{t('contact.sendAnother')}</Button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">{t('contact.fullName')}</label>
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
                <label htmlFor="email">{t('contact.emailAddress')}</label>
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
                <label htmlFor="subject">{t('contact.subject')}</label>
                <select 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>{t('contact.selectSubject')}</option>
                  <option value="General Inquiry">{t('contact.general')}</option>
                  <option value="Product Information">{t('contact.productInfo')}</option>
                  <option value="After-Sales Service">{t('contact.afterSales')}</option>
                  <option value="Press & Media">{t('contact.press')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">{t('contact.message')}</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  rows="5"
                  placeholder={t('contact.messagePlaceholder')}
                ></textarea>
              </div>

              <Button type="submit" variant="primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? t('contact.sending') : t('contact.send')}
              </Button>
            </form>
          )}
        </Motion.div>
      </div>
    </div>
  )
}
