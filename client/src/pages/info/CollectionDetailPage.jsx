import { useLoaderData, Link } from 'react-router-dom'
import { useMemo } from 'react'
import PageTransition from '@/components/common/PageTransition'
import Button from '@/components/common/Button'
import ProductGrid from '@/components/product/ProductGrid'
import { resolveCollectionCoverImage } from '@/utils/watchImageResolver'
import heroVideo from '@/assets/videos/Patek Philippe Background Video.mp4'
import galleryVideo from '@/assets/videos/Audemars Piguet - Royal Oak.mp4'
import storyImage from '@/assets/images/Photos/Luxury and Heritage Cover Image.jpg'
import galleryPoster from '@/assets/images/Photos/Rolex Cover Image2.jpg'
import craftCrown from '@/assets/images/Marquee/crown.png'
import craftHorse from '@/assets/images/Marquee/horse.png'
import craftSwiss from '@/assets/images/Marquee/SwissMade.png'
import craftKey from '@/assets/images/Marquee/key.png'
import './CollectionDetailPage.css'

const CRAFT_FEATURES = [
  {
    icon: craftSwiss,
    title: 'Swiss Atelier',
    description: 'Hand-finished movements refined in the heart of Swiss watchmaking.',
  },
  {
    icon: craftCrown,
    title: 'Gilded Precision',
    description: 'Gold-toned detailing framed by meticulous polishing and brushed contours.',
  },
  {
    icon: craftHorse,
    title: 'Endurance',
    description: 'Built for daily ceremony, with resilient seals and enduring materials.',
  },
  {
    icon: craftKey,
    title: 'Heritage Codes',
    description: 'Each case echoes archival signatures and modern engineering.',
  },
]

const CATEGORY_BY_SLUG = {
  heritage: 'classic',
  'casual-everyday': 'classic',
  'sport-elite': 'sport',
  'noir-series': 'luxury',
  'mens-collection': 'luxury',
  'womens-collection': 'classic',
}

export default function CollectionDetailPage() {
  const data = useLoaderData()
  const collection = data?.collection
  const watches = useMemo(() => (Array.isArray(data?.watches) ? data.watches : []), [data])

  const collectionName = collection?.name ?? 'Van Der Linde Collection'
  const collectionDescription =
    collection?.description ??
    'An elevated selection of timepieces curated to express balance, refinement, and presence.'
  const collectionHeroPoster = resolveCollectionCoverImage(collection?.coverImage)

  const curatedWatches = useMemo(() => {
    const slug = collection?.slug
    const category = slug ? CATEGORY_BY_SLUG[slug] : null
    const filtered = category ? watches.filter((watch) => watch?.category === category) : watches
    const result = filtered.length > 0 ? filtered : watches
    return result.slice(0, 6)
  }, [collection, watches])

  return (
    <PageTransition>
      <div className="collection-detail">
        <section className="collection-hero">
          <div className="collection-hero__media" aria-hidden="true">
            <video
              className="collection-hero__video"
              autoPlay
              muted
              loop
              playsInline
              poster={collectionHeroPoster}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <img className="collection-hero__poster" src={collectionHeroPoster} alt="" aria-hidden="true" />
          </div>
          <div className="collection-hero__overlay" aria-hidden="true" />

          <div className="collection-hero__content">
            <p className="collection-hero__eyebrow">Van Der Linde Collections</p>
            <h1 className="collection-hero__title">{collectionName}</h1>
            <p className="collection-hero__description">{collectionDescription}</p>
            <div className="collection-hero__actions">
              <Button to="/shop" variant="primary">
                Shop Collection
              </Button>
              <Button href="#craft" variant="secondary">
                Explore Craft
              </Button>
            </div>
            <Link className="collection-hero__link" to="/collections">
              Back to collections
            </Link>
          </div>
        </section>

        <section className="collection-section collection-story" aria-labelledby="collection-story">
          <div className="collection-section__inner collection-story__layout">
            <div className="collection-story__content">
              <p className="collection-section__eyebrow">Collection Story</p>
              <h2 id="collection-story" className="collection-section__title">
                Crafted for the modern heirloom
              </h2>
              <p className="collection-section__body">
                {collectionName} brings together modern silhouettes and heritage cues. Each reference balances
                understated glamour with exceptional build quality, offering a quiet statement for collectors who
                value precision and presence.
              </p>
              <p className="collection-section__body">
                From brushed bezels to sculpted lugs, every detail is tuned to feel composed and luxurious. This is
                a collection made to move from boardroom to evening engagement without losing its poise.
              </p>
            </div>
            <div className="collection-story__media">
              <img className="collection-story__image" src={storyImage} alt={`${collectionName} editorial`} />
            </div>
          </div>
        </section>

        <section className="collection-section collection-signature" aria-labelledby="collection-signature">
          <div className="collection-section__inner">
            <div className="collection-section__header">
              <div>
                <p className="collection-section__eyebrow">Signature pieces</p>
                <h2 id="collection-signature" className="collection-section__title">
                  Curated highlights
                </h2>
              </div>
              <p className="collection-section__subtitle">
                A focused lineup of references chosen to represent the collection’s character.
              </p>
            </div>
            <ProductGrid watches={curatedWatches} />
          </div>
        </section>

        <section className="collection-section collection-craft" id="craft" aria-labelledby="collection-craft">
          <div className="collection-section__inner">
            <div className="collection-section__header">
              <div>
                <p className="collection-section__eyebrow">Craftsmanship</p>
                <h2 id="collection-craft" className="collection-section__title">
                  Materials & mastery
                </h2>
              </div>
              <p className="collection-section__subtitle">
                Every component is selected to deliver longevity, refinement, and mechanical clarity.
              </p>
            </div>
            <div className="collection-craft__grid">
              {CRAFT_FEATURES.map((feature) => (
                <article key={feature.title} className="collection-craft__card">
                  <img className="collection-craft__icon" src={feature.icon} alt="" aria-hidden="true" />
                  <h3 className="collection-craft__title">{feature.title}</h3>
                  <p className="collection-craft__body">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="collection-section collection-motion" aria-labelledby="collection-motion">
          <div className="collection-section__inner collection-motion__layout">
            <div className="collection-motion__content">
              <p className="collection-section__eyebrow">Gallery</p>
              <h2 id="collection-motion" className="collection-section__title">
                Motion study
              </h2>
              <p className="collection-section__body">
                The collection’s signature movement is showcased in motion, highlighting sculpted lines and the
                subtle light play of polished steel.
              </p>
              <Button to="/shop" variant="secondary">
                Discover the range
              </Button>
            </div>
            <div className="collection-motion__frame">
              <video className="collection-motion__video" autoPlay muted loop playsInline poster={galleryPoster}>
                <source src={galleryVideo} type="video/mp4" />
              </video>
              <img className="collection-motion__poster" src={galleryPoster} alt="" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="collection-section collection-cta" aria-label="Collection call to action">
          <div className="collection-section__inner collection-cta__inner">
            <div>
              <p className="collection-section__eyebrow">Ready to explore</p>
              <h2 className="collection-section__title">Begin your Van Der Linde collection journey</h2>
              <p className="collection-section__body">
                Compare references, review movements, and reserve the piece that best reflects your signature style.
              </p>
            </div>
            <div className="collection-cta__actions">
              <Button to="/shop" variant="primary">
                Shop all watches
              </Button>
              <Button to="/contact" variant="ghost">
                Speak to concierge
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
