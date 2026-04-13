/**
 * HomePage
 *
 * What this file is:
 * Hero-first homepage for Van Der Linde.
 *
 * Collections section uses a sticky-intro scroll pattern:
 * The intro panel is position:sticky left:0 inside the scroll container,
 * so cards slide over it on drag.
 *
 * State 1 (scrollLeft=0): intro visible, first card fills the right side of the viewport.
 * State 2 (drag left): cards slide left, covering the sticky intro.
 * Drag right back: scrollLeft returns to 0, intro re-emerges exactly.
 *
 * Bug fix: section and scroll container are now separate elements so
 * IntersectionObserver ref and scroll ref don't overwrite each other.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion as Motion, useInView } from 'framer-motion'
import heroVideo from '@/assets/videos/hero.mp4'
import collectionFallbackImage from '@/assets/images/notFound1.svg'
import marqueeCrown from '@/assets/images/Marquee/crown.png'
import marqueeHorse from '@/assets/images/Marquee/horse.png'
import marqueeSwissMade from '@/assets/images/Marquee/SwissMade.png'
import marqueeKey from '@/assets/images/Marquee/key.png'
import heritageImage from '@/assets/images/Photos/Heritage.avif'
import watchCartierTankMust from '@/assets/images/Watches/Cartier Tank Must.png'
import watchDeVilleTresor from '@/assets/images/Watches/De Ville Tresor.png'
import watchRolexLadyDatejust from '@/assets/images/Watches/Rolex Lady Datejust.png'
import watchPatekNautilusWhiteGold from '@/assets/images/Watches/Patek Philippe Nautilus White Gold.png'
import watchSaxonia from '@/assets/images/Watches/Saxonia.png'
import watchAPRoyalOakOffshore from '@/assets/images/Watches/Audemars Piguet Royal Oak Offshore.png'
import watchSantosDeCartier from '@/assets/images/Watches/Santos de Cartier.png'
import watchTankLouisCartier from '@/assets/images/Watches/Tank Louis Cartier.png'
import watchModel from '@/assets/3D Models/watch.glb'
import collections from '@/data/collections.json'
import products from '@/data/products.json'
import testimonials from '@/data/testimonials.json'
import '@/pages/home/HomePage.css'

/*
  HomePage section flow:
  1) Hero
  2) Trust marquee
  3) Collections (drag + sticky intro)
  4) Favorites (3-slot carousel)
  5) Gender split
  6) Quiz CTA
  7) Configurator (3D model)
  8) Reviews
  9) Heritage/About
*/

/*
  ============================================================================
  STATIC ASSET RESOLUTION HELPERS
  ============================================================================

  products.json stores image paths as plain strings. Vite needs static imports
  or known globs to bundle assets correctly, so the helpers below normalize the
  paths and resolve each watch image to a runtime-safe URL.
*/

const watchImageAssets = import.meta.glob('/src/assets/images/Watches/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

// Build a fallback lookup by filename (without extension) for tolerant matching.
const watchImageByBaseName = Object.entries(watchImageAssets).reduce((lookup, [assetPath, assetUrl]) => {
  const fileName = assetPath.split('/').pop() ?? ''
  const baseName = fileName.toLowerCase().replace(/\.[^.]+$/, '')
  lookup[baseName] = assetUrl
  return lookup
}, {})

// Resolves a generic product image string to a guaranteed displayable URL.
const resolveProductImage = (imagePath) => {
  if (typeof imagePath !== 'string' || !imagePath.trim()) {
    return collectionFallbackImage
  }

  const normalizedPath = imagePath.trim().replace(/^@\//, '/src/')
  if (watchImageAssets[normalizedPath]) {
    return watchImageAssets[normalizedPath]
  }

  const fileName = normalizedPath.split('/').pop() ?? ''
  const baseName = fileName.toLowerCase().replace(/\.[^.]+$/, '')
  return watchImageByBaseName[baseName] ?? collectionFallbackImage
}

// Product-specific overrides for assets that need cleaner alternatives in UI.
const favoriteImageOverrides = {
  // This source asset contains decorative horizontal trails in the file itself,
  // which makes the watch appear cropped/small inside the favorites slots.
  'watch-004': watchRolexLadyDatejust,
}

// Favorites resolver uses overrides first, then falls back to generic resolver.
const resolveFavoriteImage = (product) => {
  if (!product) return collectionFallbackImage
  return favoriteImageOverrides[product._id] ?? resolveProductImage(product.images?.[0])
}

export default function HomePage() {
  // ============================================================================
  // SECTION REFERENCES (observed for in-view animation triggers)
  // ============================================================================

  // IntersectionObserver watches the section element to trigger entrance animations.
  const collectionsSectionRef = useRef(null)
  const favoritesSectionRef = useRef(null)
  const configuratorSectionRef = useRef(null)
  const genderSectionRef = useRef(null)
  const quizSectionRef = useRef(null)
  const heritageSectionRef = useRef(null)
  const reviewsSectionRef = useRef(null)

  // ============================================================================
  // INTERACTION REFS (mutable values that should not trigger re-renders)
  // ============================================================================

  // Scroll ref is on the inner scroll container, separate from the section.
  // Previously both refs were on the same element — the section ref was overwritten.
  const scrollTrackRef = useRef(null)

  // Drag state tracked in refs to avoid unnecessary re-renders during pointer events.
  const isDraggingRef = useRef(false)
  const pointerStartXRef = useRef(0)
  const pointerStartScrollRef = useRef(0)
  const favoriteTransitionTimeoutRef = useRef(null)
  const isFavoriteTransitioningRef = useRef(false)

  // Tracks total drag distance so click-through on cards is suppressed after a real drag.
  const dragDistanceRef = useRef(0)

  // ============================================================================
  // COMPONENT STATE
  // ============================================================================

  // Collections intro/cards entry animation switch.
  const [isCollectionsVisible, setIsCollectionsVisible] = useState(false)

  // Favorites carousel index + transition direction (left/right).
  const [activeFavoriteIndex, setActiveFavoriteIndex] = useState(0)
  const [favoriteDirection, setFavoriteDirection] = useState(1)

  // Temporary lock flag to block rapid repeated carousel clicks.
  const [isFavoriteTransitioning, setIsFavoriteTransitioning] = useState(false)

  // Configurator reveal toggle.
  const [isConfiguratorVisible, setIsConfiguratorVisible] = useState(false)

  // Reviews pagination state.
  const [activeReviewPage, setActiveReviewPage] = useState(0)

  // Number of testimonial cards per page (responsive).
  const [reviewsPerPage, setReviewsPerPage] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches ? 1 : 3
  )

  // ============================================================================
  // DERIVED DATA + VIEWPORT FLAGS
  // ============================================================================

  // Homepage sections use curated subsets for performance and visual focus.
  const featured = collections.slice(0, 4)
  const favoriteProducts = products.slice(0, 6)

  // Favorites slider behavior knobs:
  // - count: number of products that participate in carousel logic.
  // - cooldown: lockout window between navigation actions.
  // - slot transition: shared easing/duration used by all three watch slots.
  const favoriteCount = favoriteProducts.length
  const favoriteSwitchCooldownMs = 1050
  const favoriteSlotTransition = { duration: 0.95, ease: [0.22, 1, 0.36, 1] }

  // Preferred starting camera orbit for the 3D model showcase.
  const watchInitialOrbit = '315deg 25deg auto'

  // Section visibility flags (used to trigger entrance motion once per section).
  const isFavoritesInView = useInView(favoritesSectionRef, { once: true, margin: '-120px' })
  const isGenderInView = useInView(genderSectionRef, { once: true, margin: '-100px' })
  const isQuizInView = useInView(quizSectionRef, { once: true, margin: '-100px' })
  const isHeritageInView = useInView(heritageSectionRef, { once: true, margin: '-120px' })
  const isReviewsInView = useInView(reviewsSectionRef, { once: true, margin: '-120px' })

  // ============================================================================
  // FAVORITES CAROUSEL INDEXING + NAVIGATION HELPERS
  // ============================================================================

  // Circular index helper so the favorites slider loops seamlessly.
  const wrapFavoriteIndex = (index) => {
    if (!favoriteCount) return 0
    return (index + favoriteCount) % favoriteCount
  }

  // Derive neighbor indices from the active center index.
  const clampedFavoriteIndex = wrapFavoriteIndex(activeFavoriteIndex)
  const previousFavoriteIndex = wrapFavoriteIndex(clampedFavoriteIndex - 1)
  const nextFavoriteIndex = wrapFavoriteIndex(clampedFavoriteIndex + 1)

  // Resolve each visible product for the left / center / right slots.
  const activeFavorite = favoriteProducts[clampedFavoriteIndex] ?? null
  const previousFavorite = favoriteProducts[previousFavoriteIndex] ?? null
  const nextFavorite = favoriteProducts[nextFavoriteIndex] ?? null

  // Prevent overlap between transitions so animation remains smooth and readable.
  // Debounces rapid clicks so each transition completes before the next one starts.
  const lockFavoriteSwitch = () => {
    if (isFavoriteTransitioningRef.current) return false

    isFavoriteTransitioningRef.current = true
    setIsFavoriteTransitioning(true)

    if (favoriteTransitionTimeoutRef.current) {
      clearTimeout(favoriteTransitionTimeoutRef.current)
    }

    favoriteTransitionTimeoutRef.current = setTimeout(() => {
      isFavoriteTransitioningRef.current = false
      setIsFavoriteTransitioning(false)
      favoriteTransitionTimeoutRef.current = null
    }, favoriteSwitchCooldownMs)

    return true
  }

  const shiftFavorites = (direction) => {
    if (!favoriteCount) return
    if (!lockFavoriteSwitch()) return

    // Direction is forwarded to animation variants to choose travel side.
    setFavoriteDirection(direction)
    setActiveFavoriteIndex((prev) => wrapFavoriteIndex(prev + direction))
  }

  const shiftFavoritesLeft = () => {
    // Left arrow navigates to the previous watch.
    shiftFavorites(-1)
  }

  const shiftFavoritesRight = () => {
    // Right arrow navigates to the next watch.
    shiftFavorites(1)
  }

  const goToFavorite = (index) => {
    if (!favoriteCount) return

    const targetIndex = wrapFavoriteIndex(index)
    if (targetIndex === clampedFavoriteIndex) return
    if (!lockFavoriteSwitch()) return

    // Choose shortest circular path so transitions feel natural.
    const forwardDistance = (targetIndex - clampedFavoriteIndex + favoriteCount) % favoriteCount
    setFavoriteDirection(forwardDistance <= favoriteCount / 2 ? 1 : -1)
    setActiveFavoriteIndex(targetIndex)
  }

  // Generates a simple visual star string from a numeric rating.
  const renderFavoriteStars = (ratingValue = 0) =>
    Array.from({ length: 5 }, (_, starIndex) =>
      starIndex < Math.round(Number(ratingValue) || 0) ? '★' : '☆'
    ).join(' ')

  // Three visual slots: previous, active, next.
  const favoriteRailItems = [
    {
      slot: 'left',
      product: previousFavorite,
      index: previousFavoriteIndex,
    },
    {
      slot: 'center',
      product: activeFavorite,
      index: clampedFavoriteIndex,
    },
    {
      slot: 'right',
      product: nextFavorite,
      index: nextFavoriteIndex,
    },
  ].filter((item) => item.product)

  // ============================================================================
  // FRAMER MOTION VARIANTS
  // ============================================================================

  // Text/details panel slides slightly in the selected direction.
  const favoriteSwitchVariants = {
    enter: (direction) => ({
      // Enter from opposite side of intended direction.
      opacity: 0,
      x: direction > 0 ? 18 : -18,
    }),
    center: {
      // Resting state at center.
      opacity: 1,
      x: 0,
    },
    exit: (direction) => ({
      // Exit toward motion direction.
      opacity: 0,
      x: direction > 0 ? -18 : 18,
    }),
  }

  // Watch slot transforms create the center-focus carousel composition.
  const favoriteSlotVariants = {
    left: {
      scale: 0.58,
      x: -44,
      y: 8,
      opacity: 1,
    },
    center: {
      scale: 1.14,
      x: 0,
      y: 0,
      opacity: 1,
    },
    right: {
      scale: 0.58,
      x: 44,
      y: 8,
      opacity: 1,
    },
  }

  // Generic hover variant reused by both gender panels.
  const genderImageHoverVariants = {
    hover: { scale: 1.06 },
  }

  // Heritage block enters as one group, then reveals children in sequence.
  const heritageBoxVariants = {
    hidden: { opacity: 0, y: 36, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        when: 'beforeChildren',
        staggerChildren: 0.12,
      },
    },
  }

  // Child-level reveal motion for heritage typography and CTA.
  const heritageItemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  }

  // ============================================================================
  // STATIC SECTION DATA (display-only arrays)
  // ============================================================================

  // Product visuals shown in the quiz teaser rail.
  const quizWatches = [
    { src: watchCartierTankMust, name: 'Cartier Tank Must' },
    { src: watchRolexLadyDatejust, name: 'Rolex Lady Datejust' },
    { src: watchDeVilleTresor, name: 'De Ville Tresor' },
    { src: watchAPRoyalOakOffshore, name: 'Audemars Piguet Royal Oak Offshore' },
    { src: watchPatekNautilusWhiteGold, name: 'Patek Philippe Nautilus White Gold' },
    { src: watchSaxonia, name: 'Saxonia' },
    { src: watchSantosDeCartier, name: 'Santos de Cartier' },
    { src: watchTankLouisCartier, name: 'Tank Louis Cartier' },
  ]

  // Marquee cards duplicate to form a continuous horizontal loop.
  const trustStripItems = [
    {
      icon: marqueeCrown,
      title: 'Customer Service',
      subtitle: 'For any question please contact customer service@gmail.com',
    },
    {
      icon: marqueeHorse,
      title: 'Complimentary Delivery',
      subtitle: 'on all orders',
    },
    {
      icon: marqueeSwissMade,
      title: 'Swiss Made',
      subtitle: 'guaranteed authenticity',
    },
    {
      icon: marqueeKey,
      title: 'Secure Payment',
      subtitle: 'for all payments',
    },
  ]

  // ============================================================================
  // REVIEWS PAGINATION HELPERS
  // ============================================================================

  // Review cards are paged responsively: desktop shows 3, mobile shows 1.
  const totalReviewPages = Math.max(1, Math.ceil(testimonials.length / reviewsPerPage))
  const clampedReviewPage = Math.min(activeReviewPage, totalReviewPages - 1)

  // Current testimonial page window.
  const visibleTestimonials = testimonials.slice(
    clampedReviewPage * reviewsPerPage,
    clampedReviewPage * reviewsPerPage + reviewsPerPage
  )

  // Avatar initials derive from reviewer full names.
  const getReviewerInitials = (name) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk.charAt(0))
      .join('')
      .toUpperCase()

  // Carousel-like page controls for testimonial cards.
  const goToPreviousReviewPage = () => {
    // Wrap around to the last page when navigating backward from first page.
    setActiveReviewPage((prev) => (Math.min(prev, totalReviewPages - 1) - 1 + totalReviewPages) % totalReviewPages)
  }

  const goToNextReviewPage = () => {
    // Wrap around to first page when navigating forward from last page.
    setActiveReviewPage((prev) => (Math.min(prev, totalReviewPages - 1) + 1) % totalReviewPages)
  }

  // Dot-based random access for review pages.
  const goToReviewPage = (pageIndex) => {
    setActiveReviewPage(pageIndex)
  }

  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================

  // IntersectionObserver triggers the stagger entrance animation once on first viewport entry.
  useEffect(() => {
    // Observe collections once, then keep cards visible for the session.
    const sectionNode = collectionsSectionRef.current
    if (!sectionNode) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCollectionsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(sectionNode)
    return () => observer.disconnect()
  }, [])

  // Triggers configurator entrance classes once the section enters viewport.
  useEffect(() => {
    // Observe configurator once to trigger left/right entrance classes.
    const sectionNode = configuratorSectionRef.current
    if (!sectionNode) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsConfiguratorVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(sectionNode)
    return () => observer.disconnect()
  }, [])

  // Keeps testimonial pagination responsive across viewport changes.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    // Match JS pagination behavior to CSS mobile breakpoint.
    const query = window.matchMedia('(max-width: 768px)')
    const updateReviewsPerPage = () => {
      setReviewsPerPage(query.matches ? 1 : 3)
    }

    updateReviewsPerPage()
    query.addEventListener('change', updateReviewsPerPage)
    return () => query.removeEventListener('change', updateReviewsPerPage)
  }, [])

  // Cleanup pending timers to avoid stale state updates on unmount.
  useEffect(() => {
    // Ensure no pending timeout updates state after unmount.
    return () => {
      if (favoriteTransitionTimeoutRef.current) {
        clearTimeout(favoriteTransitionTimeoutRef.current)
      }
      isFavoriteTransitioningRef.current = false
    }
  }, [])

  // Always restore State 1 on mount so the section starts from the composed baseline.
  useEffect(() => {
    if (!scrollTrackRef.current) return
    scrollTrackRef.current.scrollLeft = 0
  }, [])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  // Arrow buttons scroll the inner track by one card-width step.
  const scrollBy = (offset) => {
    // Uses native smooth scrolling for parity with wheel/touch behavior.
    scrollTrackRef.current?.scrollBy({ left: offset, behavior: 'smooth' })
  }

  // ── Pointer drag handlers ──────────────────────────────────────────────────
  // Supports mouse drag on desktop in addition to native touch/wheel scroll.

  const handlePointerDown = (e) => {
    if (!scrollTrackRef.current) return

    // Capture pointer to keep drag active even if cursor leaves element bounds.
    isDraggingRef.current = true
    dragDistanceRef.current = 0
    pointerStartXRef.current = e.clientX
    pointerStartScrollRef.current = scrollTrackRef.current.scrollLeft
    scrollTrackRef.current.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !scrollTrackRef.current) return
    const deltaX = e.clientX - pointerStartXRef.current
    dragDistanceRef.current = Math.abs(deltaX)
    // Invert deltaX: dragging left (negative delta) increases scrollLeft.
    scrollTrackRef.current.scrollLeft = pointerStartScrollRef.current - deltaX
  }

  const handlePointerUp = (e) => {
    // Shared release handler for up/cancel/leave pathways.
    isDraggingRef.current = false
    scrollTrackRef.current?.releasePointerCapture?.(e.pointerId)
  }

  // Suppress link navigation if the pointer moved more than 8px — it was a drag, not a click.
  const handleCardClick = (e) => {
    if (dragDistanceRef.current > 8) {
      // Cancel click-through if user was dragging horizontally.
      e.preventDefault()
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  // Render order mirrors the intended homepage storytelling sequence.
  return (
    <div className="home-page">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="home-hero" aria-label="Van Der Linde luxury watches">
        {/* Background video layer */}
        <video
          className="home-hero__video"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          {/* Vite import ensures correct asset fingerprinting and CDN path. */}
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Overlay kept transparent per design direction — preserves full video clarity. */}
        <div className="home-hero__overlay" aria-hidden="true" />

        {/* Foreground title, subtitle, and discovery CTA */}
        <div className="home-hero__content">
          <h1 className="home-hero__title">
            <span className="home-hero__title-line">THE ART OF</span>
            <span className="home-hero__title-line">WATCHMAKING</span>
          </h1>
          <p className="home-hero__subtitle">
            Explore exceptional vintage and luxury watches crafted with precision, heritage,
            and timeless elegance.
          </p>
          {/*
            JS scroll avoids the fixed header covering the section target,
            which would happen with a plain href="#collections" anchor.
          */}
          <button
            type="button"
            className="home-hero__cta"
            onClick={() =>
              document
                .getElementById('collections')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          >
            Discover More
          </button>
        </div>
      </section>

      {/* ── TRUST STRIP MARQUEE ─────────────────────────────────────────── */}
      <section
        className="home-trust"
        aria-label="Service and trust highlights"
      >
        {/* Outer clipping wrapper for marquee track */}
        <div className="home-trust__marquee">
          {/* Two duplicated groups create a continuous marquee loop. */}
          <div className="home-trust__track">
            {/* Duplicate group creates a seamless right-to-left loop. */}
            {[0, 1].map((groupIndex) => (
              <div
                key={`trust-group-${groupIndex}`}
                className="home-trust__group"
                aria-hidden={groupIndex === 1}
              >
                {trustStripItems.map((item) => (
                  <article key={`${groupIndex}-${item.title}`} className="home-trust__item">
                    <img
                      className="home-trust__icon"
                      src={item.icon}
                      alt=""
                      loading="lazy"
                      aria-hidden="true"
                    />
                    <h2 className="home-trust__title">{item.title}</h2>
                    <p className="home-trust__subtitle">{item.subtitle}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ───────────────────────────────────────────────────── */}
      {/*
        Layout model:
        <section>                      → IntersectionObserver target, background, no scroll
          .home-collections__scroll    → overflow-x:scroll, flex container, drag target
            .home-collections__intro   → position:sticky left:0, never scrolls away
            .home-collections__cards   → flex row, padding-left pushes first card to right side

        State 1 (scrollLeft=0):
          intro fully visible on left,
          first card's left edge starts at (100vw - card-width) — fills right side.

        State 2 (drag left):
          cards slide left, covering the sticky intro underneath.

        Drag right back:
          scrollLeft returns to 0, intro fully re-emerges. Exact state 1.
      */}
      <section
        id="collections"
        ref={collectionsSectionRef}
        className="home-collections"
        aria-label="Featured collections"
      >
        {/*
          Scroll container is its own element so the section ref (IntersectionObserver)
          and scroll ref don't overwrite each other — that was the original bug.
          All pointer events live here so the full scroll surface is draggable.
        */}
        <div
          className="home-collections__scroll"
          ref={scrollTrackRef}
        >

          {/*
            Intro is sticky left:0 with z-index above cards so it sits in front at rest.
            The right-side fade gradient dissolves cleanly into cards sliding underneath.
          */}
          <div
            className={`home-collections__intro${
              isCollectionsVisible ? ' home-collections__intro--visible' : ''
            }`}
          >
            {/* Intro copy + utility nav */}
            <p className="home-collections__label">OUR COLLECTIONS</p>
            <h2 className="home-collections__title">OUR 2026 NOVELTIES</h2>
            <Link
              className="home-collections__view-all"
              to="/collections"
            >
              Explore our collections
            </Link>

            {/* Arrows are inside the intro so they're always accessible regardless of scroll position. */}
            <div className="home-collections__arrows">
              <button
                type="button"
                className="home-collections__arrow"
                onClick={() => scrollBy(-420)}
                aria-label="Scroll collections left"
              >
                ←
              </button>
              <button
                type="button"
                className="home-collections__arrow"
                onClick={() => scrollBy(420)}
                aria-label="Scroll collections right"
              >
                →
              </button>
            </div>
          </div>

          {/*
            Cards sit to the right of the intro inside the scroll container.
            padding-left on this wrapper is what creates State 1:
            it pushes the first card's left edge to (100vw - card-width),
            so it starts on the right side of the viewport at scrollLeft=0.
          */}
          <div
            className="home-collections__cards"
            aria-label="Featured collections carousel"
            // Drag behavior is intentionally scoped to cards only so intro links remain clickable.
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Mapped collection cards */}
            {featured.map((collection, index) => (
              <article
                key={collection._id}
                className={`home-collection-card${
                  isCollectionsVisible ? ' home-collection-card--visible' : ''
                }`}
                // Stagger: each card animates 100ms after the previous one.
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div
                  className="home-collection-card__media"
                  style={{
                    // Primary: JSON coverImage. Fallback: Vite-resolved imported asset.
                    backgroundImage: `url(${collection.coverImage}), url(${collectionFallbackImage})`,
                  }}
                  aria-hidden="true"
                />

                {/* Bottom gradient keeps text legible over any image content. */}
                <div className="home-collection-card__shade" aria-hidden="true" />

                <div className="home-collection-card__content">
                  <h3 className="home-collection-card__name">{collection.name}</h3>
                  <p className="home-collection-card__description">{collection.description}</p>
                  <Link
                    className="home-collection-card__link"
                    to={`/collections/${collection.slug}`}
                    onClick={handleCardClick}
                  >
                    Explore <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      {/* ── END COLLECTIONS ── */}

      {/* ── SHOP FAVORITES ───────────────────────────────────────────── */}
      <section
        ref={favoritesSectionRef}
        className="home-favorites"
        aria-label="Shop your favorites"
      >
        <div className="home-favorites__inner">
          <Motion.h2
            className="home-favorites__title"
            initial={{ opacity: 0, y: 18 }}
            animate={isFavoritesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            SHOP YOUR FAVORITES
          </Motion.h2>

          {activeFavorite ? (
            <Motion.div
              className="home-favorites__stage"
              initial={{ opacity: 0, y: 26 }}
              animate={isFavoritesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
              transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
            >
              {/* Previous watch control */}
              <button
                type="button"
                className="home-favorites__nav home-favorites__nav--left"
                onClick={shiftFavoritesLeft}
                disabled={isFavoriteTransitioning}
                aria-label="Show previous watch"
              >
                ←
              </button>

              <div className="home-favorites__rail" aria-live="polite">
                {/* Exactly three slots: previous, active center, next */}
                {favoriteRailItems.map(({ slot, product, index }) => (
                  <Motion.div
                    key={product._id}
                    layout="position"
                    className={`home-favorites__watch-slot home-favorites__watch-slot--${slot}`}
                    variants={favoriteSlotVariants}
                    initial={false}
                    animate={slot}
                    transition={{
                      layout: favoriteSlotTransition,
                      ...favoriteSlotTransition,
                    }}
                  >
                    {slot === 'center' ? (
                      // Center card links directly to product detail page.
                      <Link
                        className="home-favorites__watch-link home-favorites__watch-link--center"
                        to={`/watch/${product._id}`}
                        aria-label={`View details for ${product.name}`}
                      >
                        <img
                          className="home-favorites__watch-image"
                          src={resolveFavoriteImage(product)}
                          alt={product.name}
                          loading="lazy"
                        />
                      </Link>
                    ) : (
                      // Side cards are promotion buttons that move into center.
                      <button
                        type="button"
                        className="home-favorites__watch-link"
                        onClick={() => goToFavorite(index)}
                        disabled={isFavoriteTransitioning}
                        aria-label={`Show ${product.name} in the center`}
                      >
                        <img
                          className="home-favorites__watch-image"
                          src={resolveFavoriteImage(product)}
                          alt=""
                          loading="lazy"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </Motion.div>
                ))}
              </div>

              <button
                type="button"
                className="home-favorites__nav home-favorites__nav--right"
                onClick={shiftFavoritesRight}
                disabled={isFavoriteTransitioning}
                aria-label="Show next watch"
              >
                →
              </button>

              {/* Product details panel synchronized with center-card transitions. */}
              <AnimatePresence initial={false} mode="wait" custom={favoriteDirection}>
                <Motion.article
                  key={activeFavorite._id}
                  className="home-favorites__feature"
                  custom={favoriteDirection}
                  variants={favoriteSwitchVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="home-favorites__feature-content">
                    <h3 className="home-favorites__name">{activeFavorite.name}</h3>
                    <p className="home-favorites__description">{activeFavorite.description}</p>
                    <p
                      className="home-favorites__rating"
                      aria-label={`${Number(activeFavorite.rating || 0).toFixed(1)} out of 5 stars`}
                    >
                      <span className="home-favorites__stars" aria-hidden="true">
                        {renderFavoriteStars(activeFavorite.rating)}
                      </span>
                      <span className="home-favorites__reviews">
                        {Number(activeFavorite.rating || 0).toFixed(1)} ({activeFavorite.numReviews || 0})
                      </span>
                    </p>
                  </div>

                  <div className="home-favorites__actions">
                    {/* Primary and secondary navigation actions */}
                    <Link className="home-favorites__action home-favorites__action--solid" to="/shop">
                      Shop All
                    </Link>
                    <Link className="home-favorites__action home-favorites__action--ghost" to="/gifting">
                      Buy As A Gift?
                    </Link>
                  </div>
                </Motion.article>
              </AnimatePresence>
            </Motion.div>
          ) : null}
        </div>
      </section>

      {/* ── GENDER SPLIT ───────────────────────────────────────────────── */}
      <section
        ref={genderSectionRef}
        className="home-gender"
        aria-label="Shop by gender"
      >
        {/* Left promotional panel */}
        <Motion.article
          className="home-gender__panel home-gender__panel--him"
          initial={{ opacity: 0, y: 30 }}
          animate={isGenderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0, ease: 'easeOut' }}
          whileHover="hover"
        >
          <Link
            className="home-gender__panel-link"
            to="/shop/men"
            aria-label="Shop men's watches"
          />
          <Motion.div
            className="home-gender__image"
            variants={genderImageHoverVariants}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />
          <div className="home-gender__overlay" aria-hidden="true" />

          <div className="home-gender__content">
            <h3 className="home-gender__title">FOR HIM</h3>
            <p className="home-gender__subtitle">BOLD. SOPHISTICATED. TIMELESS.</p>
            <Link className="home-gender__cta" to="/shop/men">
              SHOP MEN&apos;S WATCHES
            </Link>
          </div>
        </Motion.article>

        <span className="home-gender__divider" aria-hidden="true" />

        {/* Right promotional panel */}
        <Motion.article
          className="home-gender__panel home-gender__panel--her"
          initial={{ opacity: 0, y: 30 }}
          animate={isGenderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          whileHover="hover"
        >
          <Link
            className="home-gender__panel-link"
            to="/shop/women"
            aria-label="Shop women's watches"
          />
          <Motion.div
            className="home-gender__image"
            variants={genderImageHoverVariants}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />
          <div className="home-gender__overlay" aria-hidden="true" />

          <div className="home-gender__content">
            <h3 className="home-gender__title">FOR HER</h3>
            <p className="home-gender__subtitle">ELEGANT. REFINED. EXQUISITE.</p>
            <Link className="home-gender__cta" to="/shop/women">
              SHOP WOMEN&apos;S WATCHES
            </Link>
          </div>
        </Motion.article>
      </section>

      {/* ── WATCH FINDER QUIZ CTA ─────────────────────────────────────── */}
      <section
        ref={quizSectionRef}
        className="home-quiz"
        aria-label="Find your watch quiz"
      >
        <div className="home-quiz__inner">
          {/* Quiz lead copy + action */}
          <Motion.div
            className="home-quiz__header"
            initial={{ opacity: 0, y: 20 }}
            animate={isQuizInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="home-quiz__eyebrow">Personal Selector</p>
            <h2 className="home-quiz__title">Find Your Watch</h2>
            <p className="home-quiz__subtitle">
              Need help narrowing down the best watches for your style? Take our quick quiz
              and discover your perfect match.
            </p>

            <Link className="home-quiz__cta" to="/quiz">
              Find Your Watch
            </Link>
          </Motion.div>

          {/* Visual watch strip supporting the quiz CTA */}
          <Motion.div
            className="home-quiz__rail"
            initial={{ opacity: 0, y: 26 }}
            animate={isQuizInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
            transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
          >
            {/* Repeated watch visuals for quiz theme continuity */}
            {quizWatches.map((watch, index) => (
              <Motion.figure
                key={watch.name}
                className="home-quiz__item"
                initial={{ opacity: 0, y: 14 }}
                animate={isQuizInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.45, delay: index * 0.07, ease: 'easeOut' }}
              >
                <img
                  className="home-quiz__watch"
                  src={watch.src}
                  alt={watch.name}
                  loading="lazy"
                />
              </Motion.figure>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* ── CONFIGURATOR CTA ─────────────────────────────────────────── */}
      <section
        id="configurator-cta"
        ref={configuratorSectionRef}
        className="home-configurator"
        aria-label="Configure your time"
      >
        <div className="home-configurator__inner">
          {/* Left side: narrative copy + entry link */}
          <div
            className={`home-configurator__left${
              isConfiguratorVisible ? ' home-configurator__left--visible' : ''
            }`}
          >
            <p className="home-configurator__label">Configure Your</p>
            <h2 className="home-configurator__title">TIME</h2>
            <p className="home-configurator__desc">
              Create a watch that reflects your style. Choose materials, straps, and finishes
              inspired by classic vintage craftsmanship.
            </p>

            <div className="home-configurator__cta-row">
              <span className="home-configurator__cta-line" aria-hidden="true" />
              <Link to="/configurator">START CONFIGURATION</Link>
            </div>
          </div>

          {/* Right side: interactive 3D model */}
          <div
            className={`home-configurator__right${
              isConfiguratorVisible ? ' home-configurator__right--visible' : ''
            }`}
          >
            {/*
              Add this in index.html:
              <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
            */}
            <div className="home-configurator__model-wrap">
              {/* model-viewer web component handles interactive 3D rendering */}
              <model-viewer
                src={watchModel}
                auto-rotate
                auto-rotate-delay="0"
                camera-controls
                camera-orbit={watchInitialOrbit}
                shadow-intensity="1"
                exposure="0.8"
                style={{ width: '100%', height: 'clamp(400px, 60vh, 700px)', background: 'transparent' }}
                ar
                ar-modes="webxr scene-viewer quick-look"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────────────────── */}
      <section
        ref={reviewsSectionRef}
        className="home-reviews"
        aria-label="Customer reviews"
      >
        <div className="home-reviews__inner">
          {/* Section heading */}
          <Motion.div
            className="home-reviews__header"
            initial={{ opacity: 0, y: 22 }}
            animate={isReviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="home-reviews__eyebrow">Testimonials</p>
            <h2 className="home-reviews__title">Trusted by Watch Collectors Worldwide</h2>
          </Motion.div>

          {/* Current review page cards */}
          <Motion.div
            key={`reviews-page-${clampedReviewPage}-${reviewsPerPage}`}
            className="home-reviews__grid"
            initial={{ opacity: 0, y: 20 }}
            animate={isReviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Visible testimonial slice for active page */}
            {visibleTestimonials.map((testimonial, index) => (
              <Motion.article
                key={testimonial._id}
                className="home-review-card"
                initial={{ opacity: 0, y: 20 }}
                animate={isReviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
              >
                <div className="home-review-card__top">
                  <div className="home-review-card__avatar" aria-hidden="true">
                    {getReviewerInitials(testimonial.name)}
                  </div>

                  <div className="home-review-card__meta">
                    <p className="home-review-card__name">{testimonial.name}</p>
                    <p className="home-review-card__location">{testimonial.location}</p>
                  </div>
                </div>

                <p className="home-review-card__stars" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, starIndex) =>
                    starIndex < testimonial.rating ? '★' : '☆'
                  ).join(' ')}
                </p>

                <p className="home-review-card__quote">&quot;{testimonial.quote}&quot;</p>
              </Motion.article>
            ))}
          </Motion.div>

          <div className="home-reviews__controls" aria-label="Reviews navigation">
            {/* Previous page */}
            <button
              type="button"
              className="home-reviews__arrow"
              onClick={goToPreviousReviewPage}
              aria-label="Show previous reviews"
            >
              ←
            </button>

            <div className="home-reviews__dots" role="tablist" aria-label="Review pages">
              {/* Dot buttons map 1:1 to available review pages. */}
              {Array.from({ length: totalReviewPages }, (_, pageIndex) => (
                <button
                  key={`review-dot-${pageIndex}`}
                  type="button"
                  className={`home-reviews__dot${
                    clampedReviewPage === pageIndex ? ' home-reviews__dot--active' : ''
                  }`}
                  onClick={() => goToReviewPage(pageIndex)}
                  aria-label={`Show reviews page ${pageIndex + 1}`}
                  aria-selected={clampedReviewPage === pageIndex}
                  role="tab"
                />
              ))}
            </div>

            {/* Next page */}
            <button
              type="button"
              className="home-reviews__arrow"
              onClick={goToNextReviewPage}
              aria-label="Show next reviews"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ── OUR HERITAGE (ABOUT) ───────────────────────────────────────── */}
      <section
        ref={heritageSectionRef}
        className="home-heritage"
        aria-label="Our heritage"
        style={{ '--home-heritage-bg': `url(${heritageImage})` }}
      >
        {/* Foreground glassmorphism panel over full-bleed heritage image */}
        <Motion.div
          className="home-heritage__inner"
          variants={heritageBoxVariants}
          initial="hidden"
          animate={isHeritageInView ? 'visible' : 'hidden'}
        >
          <Motion.p className="home-heritage__eyebrow" variants={heritageItemVariants}>
            OUR HERITAGE
          </Motion.p>

          <Motion.h2 className="home-heritage__title" variants={heritageItemVariants}>
            <span>Crafting&nbsp;time&nbsp;since</span>
            <span>1875</span>
          </Motion.h2>

          <Motion.p className="home-heritage__lead" variants={heritageItemVariants}>
            From a discreet Geneva workshop to a global community of collectors, Van Der Linde
            has remained devoted to precision, restraint, and timeless design.
          </Motion.p>

          <Motion.div variants={heritageItemVariants}>
            <Link className="home-heritage__cta" to="/about">
              Explore Our Heritage
            </Link>
          </Motion.div>
        </Motion.div>
      </section>

      
    </div>
  )
}