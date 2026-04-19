import { motion as Motion } from 'framer-motion'
import { Link, useLoaderData } from 'react-router-dom'
import { resolveCollectionCoverImage } from '@/utils/watchImageResolver'
import './CollectionsPage.css'

export default function CollectionsPage() {
  const collectionsData = useLoaderData()
  const collections = Array.isArray(collectionsData) ? collectionsData : []

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  }

  return (
    <div className="collections-page">
      <header className="collections-page__header">
        <Motion.h1
          className="collections-page__title"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Our Collections
        </Motion.h1>
        <Motion.p
          className="collections-page__subtitle"
          initial="hidden"
          animate="visible"
          variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.2 } } }}
        >
          Discover our curated ranges of exceptional timepieces, each defined by distinct design philosophies and masterful craftsmanship.
        </Motion.p>
      </header>

      <div className="collections-list">
        {collections.map((collection, index) => (
          <Motion.article
            key={collection._id}
            className={`collection-row ${index % 2 === 1 ? 'collection-row--reverse' : ''}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="collection-row__image-container">
              <img
                src={resolveCollectionCoverImage(collection.coverImage)}
                alt={collection.name}
                className="collection-row__image"
              />
            </div>

            <div className="collection-row__content">
              <Motion.div
                className="collection-row__text-wrap"
                variants={{
                  hidden: { opacity: 0, x: index % 2 === 0 ? 30 : -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3 } }
                }}
              >
                <h2 className="collection-row__name">{collection.name}</h2>
                <p className="collection-row__description">{collection.description}</p>
                <Link to={`/collections/${collection.slug}`} className="collection-row__link">
                  <span className="cta-line"></span>
                  View Collection
                </Link>
              </Motion.div>
            </div>
          </Motion.article>
        ))}
      </div>
    </div>
  )
}
