import { motion } from 'framer-motion'
import { useLoaderData, Link } from 'react-router-dom'
import { useMemo } from 'react'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import ProductGrid from '@/components/product/ProductGrid'
import { useLanguage } from '@/context/LanguageContext'
import womenHero from '@/assets/Models/women.png'
import galleryVideo from '@/assets/videos/Cartier watchmaking.mp4'
import galleryPoster from '@/assets/images/Photos/Rolex Cover Image2.jpg'
import storyImage from '@/assets/images/Photos/Cartier Cover Image.avif'
import craftCrown from '@/assets/images/Marquee/crown.png'
import craftHorse from '@/assets/images/Marquee/horse.png'
import craftSwiss from '@/assets/images/Marquee/SwissMade.png'
import craftKey from '@/assets/images/Marquee/key.png'
import '@/pages/info/CollectionDetailPage.css'
import './ShopGenderPage.css'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const sectionRevealProps = prefersReducedMotion
  ? {}
  : {
      initial: { opacity: 0, y: 40 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0.6, ease: 'easeOut' },
    }

const craftContainerProps = prefersReducedMotion
  ? {}
  : {
      variants: {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.08, delayChildren: 0.08 },
        },
      },
      initial: 'hidden',
      whileInView: 'visible',
      viewport: { once: true, amount: 0.2 },
    }

const craftItemProps = prefersReducedMotion
  ? {}
  : {
      variants: {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      },
    }

const CRAFT_FEATURES = [
  { icon: craftSwiss, titleKey: 'collection.swissAtelier', descriptionKey: 'collection.swissAtelierBody' },
  { icon: craftCrown, titleKey: 'collection.gildedPrecision', descriptionKey: 'collection.gildedPrecisionBody' },
  { icon: craftHorse, titleKey: 'collection.endurance', descriptionKey: 'collection.enduranceBody' },
  { icon: craftKey, titleKey: 'collection.heritageCodes', descriptionKey: 'collection.heritageCodesBody' },
]

export default function ShopWomenPage() {
  const data = useLoaderData()
  const { t } = useLanguage()
  const watches = useMemo(() => (Array.isArray(data) ? data : []), [data])

  return (
    <PageTransition>
      <div className="collection-detail">
        <section className="collection-hero shop-gender-hero">
          <div className="collection-hero__media" aria-hidden="true" style={{ background: `#1a1512 url(${womenHero}) no-repeat center 20% / cover` }}>
            <img className="collection-hero__image" src={womenHero} alt="Women's Watches" />
          </div>
          <div className="collection-hero__overlay" aria-hidden="true" />
          <div className="collection-hero__content">
            <p className="collection-hero__eyebrow">{t('shop.womensCollection')}</p>
            <h1 className="collection-hero__title">{t('shop.womensTitle')}</h1>
            <p className="collection-hero__description">{t('shop.womensSubtitle')}</p>
            <div className="collection-hero__actions">
              <Button href="#signature" variant="primary">
                {t('collection.shopCollection')}
              </Button>
              <Button href="#craft" variant="secondary">
                {t('collection.exploreCraft')}
              </Button>
            </div>
            <Link className="collection-hero__link" to="/collections">
              {t('collection.back')}
            </Link>
          </div>
        </section>

        <motion.section className="collection-section collection-story" aria-labelledby="collection-story" {...sectionRevealProps}>
          <div className="collection-section__inner collection-story__layout">
            <div className="collection-story__content">
              <p className="collection-section__eyebrow">{t('collection.storyEyebrow')}</p>
              <h2 id="collection-story" className="collection-section__title">
                {t('collection.storyTitle')}
              </h2>
              <p className="collection-section__body">
                {t('collection.storyBody1', { name: t('shop.womensCollection') })}
              </p>
              <p className="collection-section__body">
                {t('collection.storyBody2')}
              </p>
            </div>
            <div className="collection-story__media">
              <img className="collection-story__image" src={storyImage} alt="Women's editorial" />
            </div>
          </div>
        </motion.section>

        <motion.section className="collection-section collection-signature" id="signature" aria-labelledby="collection-signature" {...sectionRevealProps}>
          <div className="collection-section__inner">
            <div className="collection-section__header">
              <div>
                <p className="collection-section__eyebrow">{t('collection.signatureEyebrow')}</p>
                <h2 id="collection-signature" className="collection-section__title">
                  {t('collection.signatureTitle')}
                </h2>
              </div>
              <p className="collection-section__subtitle">
                {t('collection.signatureSubtitle')}
              </p>
            </div>
            <ProductGrid watches={watches} />
          </div>
        </motion.section>

        <motion.section className="collection-section collection-craft" id="craft" aria-labelledby="collection-craft" {...sectionRevealProps}>
          <div className="collection-section__inner">
            <div className="collection-section__header">
              <div>
                <p className="collection-section__eyebrow">{t('collection.craftEyebrow')}</p>
                <h2 id="collection-craft" className="collection-section__title">
                  {t('collection.craftTitle')}
                </h2>
              </div>
              <p className="collection-section__subtitle">
                {t('collection.craftSubtitle')}
              </p>
            </div>
            <motion.div className="collection-craft__grid" {...craftContainerProps}>
              {CRAFT_FEATURES.map((feature) => (
                <motion.article key={feature.titleKey} className="collection-craft__card" {...craftItemProps}>
                  <img className="collection-craft__icon" src={feature.icon} alt="" aria-hidden="true" />
                  <h3 className="collection-craft__title">{t(feature.titleKey)}</h3>
                  <p className="collection-craft__body">{t(feature.descriptionKey)}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="collection-section collection-motion" aria-labelledby="collection-motion" {...sectionRevealProps}>
          <div className="collection-section__inner collection-motion__layout">
            <div className="collection-motion__content">
              <p className="collection-section__eyebrow">{t('collection.galleryEyebrow')}</p>
              <h2 id="collection-motion" className="collection-section__title">
                {t('collection.motionTitle')}
              </h2>
              <p className="collection-section__body">
                {t('collection.motionBody')}
              </p>
              <Button to="/shop/women" variant="secondary">
                {t('collection.discoverRange')}
              </Button>
            </div>
            <div className="collection-motion__frame">
              <video className="collection-motion__video" autoPlay muted loop playsInline poster={galleryPoster}>
                <source src={galleryVideo} type="video/mp4" />
              </video>
              <img className="collection-motion__poster" src={galleryPoster} alt="" aria-hidden="true" />
            </div>
          </div>
        </motion.section>

        <motion.section className="collection-section collection-cta" aria-label={t('collection.ctaAria')} {...sectionRevealProps}>
          <div className="collection-section__inner collection-cta__inner">
            <div>
              <p className="collection-section__eyebrow">{t('collection.ready')}</p>
              <h2 className="collection-section__title">{t('collection.journeyTitle')}</h2>
              <p className="collection-section__body">
                {t('collection.journeyBody')}
              </p>
            </div>
            <div className="collection-cta__actions">
              <Button to="/shop" variant="primary">
                {t('collection.shopAllWatches')}
              </Button>
              <Button to="/contact" variant="ghost">
                {t('collection.concierge')}
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </PageTransition>
  )
}
