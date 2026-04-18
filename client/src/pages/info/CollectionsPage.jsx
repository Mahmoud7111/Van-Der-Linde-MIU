import { Link, useLoaderData } from 'react-router-dom'
import { resolveCollectionCoverImage } from '@/utils/watchImageResolver'
import './CollectionsPage.css'

export default function CollectionsPage() {
  const collectionsData = useLoaderData()
  const collections = Array.isArray(collectionsData) ? collectionsData : []

  return (
    <div className="collections-page">
      <header className="collections-page__header">
        <h1 className="collections-page__title">Our Collections</h1>
        <p className="collections-page__subtitle">
          Discover our curated ranges of exceptional timepieces, each defined by distinct design philosophies and masterful craftsmanship.
        </p>
      </header>

      <div className="collections-page__grid">
        {collections.map((collection) => (
          <article key={collection._id} className="collection-card">
            <Link to={`/collections/${collection.slug}`} className="collection-card__link">
              <div 
                className="collection-card__media"
                style={{ backgroundImage: `url(${resolveCollectionCoverImage(collection.coverImage)})` }}
              />
              <div className="collection-card__overlay">
                <h2 className="collection-card__name">{collection.name}</h2>
                <p className="collection-card__description">{collection.description}</p>
                <span className="collection-card__action">Explore Collection</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
