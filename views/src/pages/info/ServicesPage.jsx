import { Link } from 'react-router-dom'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import './ServicesPage.css'

const PRIMARY_SERVICES = [
  {
    title: 'Watch Configurator',
    description:
      'Design your signature timepiece by choosing case finish, dial details, and strap combinations.',
    to: '/configurator',
    cta: 'Open Configurator',
  },
  {
    title: 'Luxury Gifting',
    description:
      'Build a complete gift experience with curated wrapping, note cards, and premium presentation.',
    to: '/gifting',
    cta: 'Create a Gift',
  },
  {
    title: 'Gift Registry',
    description:
      'Set up a registry for weddings and milestone celebrations with personalized preferences.',
    to: '/gift-registry',
    cta: 'View Registry',
  },
]

const SUPPORT_LINKS = [
  { label: 'Size Guide', to: '/size-guide' },
  { label: 'Watch Quiz', to: '/quiz' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact Concierge', to: '/contact' },
]

export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="services-page">
        <section className="services-hero" aria-labelledby="services-hero-title">
          <div className="services-hero__inner">
            <p className="services-hero__eyebrow">Van Der Linde Services</p>
            <h1 id="services-hero-title" className="services-hero__title">
              Craft, gifting, and concierge support in one place
            </h1>
            <p className="services-hero__subtitle">
              Explore the tools and care services designed to make every Van Der Linde purchase
              personal, seamless, and memorable.
            </p>
          </div>
        </section>

        <section className="services-grid" aria-label="Primary services">
          <div className="services-grid__inner">
            {PRIMARY_SERVICES.map((service) => (
              <article key={service.title} className="service-card">
                <h2 className="service-card__title">{service.title}</h2>
                <p className="service-card__body">{service.description}</p>
                <Link to={service.to} className="service-card__link">
                  {service.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="services-support" aria-label="Support links">
          <div className="services-support__inner">
            <h2 className="services-support__title">More Ways We Help</h2>
            <div className="services-support__links">
              {SUPPORT_LINKS.map((item) => (
                <Link key={item.label} to={item.to} className="services-support__chip">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="services-cta" aria-label="Service call to action">
          <div className="services-cta__inner">
            <h2 className="services-cta__title">Need tailored help?</h2>
            <p className="services-cta__text">
              Our concierge team can guide product matching, gifting plans, and service questions.
            </p>
            <div className="services-cta__actions">
              <Button to="/contact" variant="primary">
                Contact Concierge
              </Button>
              <Button to="/gifting" variant="secondary">
                Start Gifting
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
