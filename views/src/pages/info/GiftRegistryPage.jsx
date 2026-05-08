import { motion as Motion } from 'framer-motion'
import Button from '@/components/common/Button'
import './GiftRegistryPage.css'

export default function GiftRegistryPage() {
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
        <span className="registry-hero__label">Celebrations</span>
        <h1 className="registry-hero__title">Gift Registry</h1>
        <p className="registry-hero__text">
          Create a curated list of Van Der Linde timepieces for your special occasion. Whether it's a wedding, anniversary, or milestone celebration, help your loved ones choose a gift that will be cherished for generations.
        </p>
        <div className="registry-hero__actions">
          <Button to="/register" variant="primary" size="lg">Create Your Registry</Button>
          <Button to="/contact" variant="outline" size="lg" style={{ marginLeft: '1rem' }}>Find a Registry</Button>
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
          <h3 className="registry-step__title">Curate</h3>
          <p className="registry-step__text">Explore our collections and add your favorite timepieces to your personal registry.</p>
        </div>
        <div className="registry-step">
          <span className="registry-step__number">02</span>
          <h3 className="registry-step__title">Share</h3>
          <p className="registry-step__text">Send your unique registry link to friends and family or share it on your event website.</p>
        </div>
        <div className="registry-step">
          <span className="registry-step__number">03</span>
          <h3 className="registry-step__title">Receive</h3>
          <p className="registry-step__text">Each gift is elegantly wrapped and delivered with a personalized note from the giver.</p>
        </div>
      </Motion.div>

      <Motion.section 
        className="registry-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="registry-cta__title">Start Your Journey</h2>
        <p className="registry-cta__text">Make your next milestone truly timeless with a Van Der Linde registry.</p>
        <Button to="/register" variant="primary">Get Started Now</Button>
      </Motion.section>
    </div>
  )
}
