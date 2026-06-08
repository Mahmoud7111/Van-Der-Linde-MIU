import { motion as Motion } from 'framer-motion'
import Button from '@/components/common/Button'
import { useLanguage } from '@/context/LanguageContext'
import './GiftRegistryPage.css'

export default function GiftRegistryPage() {
  const { t } = useLanguage()
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  }

  return (
    <div className="registry-page">
      <Motion.section 
        className="registry-hero"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <span className="registry-hero__label">{t('registry.label')}</span>
        <h1 className="registry-hero__title">{t('registry.title')}</h1>
        <p className="registry-hero__text">
          {t('registry.text')}
        </p>
        <div className="registry-hero__actions">
          <Button to="/register" variant="primary" size="lg">{t('registry.create')}</Button>
          <Button to="/contact" variant="outline" size="lg" style={{ marginLeft: '1rem' }}>{t('registry.find')}</Button>
        </div>
      </Motion.section>

      <Motion.div 
        className="registry-steps"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="registry-step">
          <span className="registry-step__number">01</span>
          <h3 className="registry-step__title">{t('registry.curate')}</h3>
          <p className="registry-step__text">{t('registry.curateText')}</p>
        </div>
        <div className="registry-step">
          <span className="registry-step__number">02</span>
          <h3 className="registry-step__title">{t('registry.share')}</h3>
          <p className="registry-step__text">{t('registry.shareText')}</p>
        </div>
        <div className="registry-step">
          <span className="registry-step__number">03</span>
          <h3 className="registry-step__title">{t('registry.receive')}</h3>
          <p className="registry-step__text">{t('registry.receiveText')}</p>
        </div>
      </Motion.div>

      <Motion.section 
        className="registry-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="registry-cta__title">{t('registry.start')}</h2>
        <p className="registry-cta__text">{t('registry.startText')}</p>
        <Button to="/register" variant="primary">{t('registry.getStarted')}</Button>
      </Motion.section>
    </div>
  )
}
