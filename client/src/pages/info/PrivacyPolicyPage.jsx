import { motion as Motion } from 'framer-motion'
import './PolicyPages.css'

export default function PrivacyPolicyPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="policy-page">
      <Motion.header 
        className="policy-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <span className="policy-header__label">Data Protection</span>
        <h1 className="policy-header__title">Privacy Policy</h1>
        <p className="policy-header__date">Last Updated: April 18, 2026</p>
      </Motion.header>

      <Motion.div 
        className="policy-content"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <section>
          <h2>1. Data Collection</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact our customer support. This may include your name, email address, shipping address, and payment information.
          </p>
          <p>
            We also collect certain information automatically when you visit our website, including your IP address, browser type, and browsing behavior.
          </p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information to provide, maintain, and improve our services, including processing transactions, sending order confirmations, and providing customer support.
          </p>
          <ul>
            <li>To personalize your experience on our website.</li>
            <li>To send promotional communications (if you have opted in).</li>
            <li>To detect and prevent fraudulent transactions.</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information to third parties. We may share your information with service providers who perform tasks on our behalf, such as payment processors and shipping companies.
          </p>
          <p>
            We may also disclose your information if required by law or to protect our rights and property.
          </p>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to analyze trends, administer the website, and track users' movements around the site. You can control the use of cookies at the individual browser level.
          </p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. Please contact us to exercise these rights.
          </p>
        </section>
      </Motion.div>
    </div>
  )
}
