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
import { motion as Motion, useInView } from 'framer-motion'
import heroVideo from '@/assets/videos/hero.mp4'
import collectionFallbackImage from '@/assets/images/notFound1.svg'
import heritageImage from '@/assets/images/Photos/Heritage.avif'
import watchModel from '@/assets/3D Models/watch.glb'
import collections from '@/data/collections.json'
import '@/pages/home/HomePage.css'

export default function HomePage() {
  // IntersectionObserver watches the section element to trigger entrance animations.
  const collectionsSectionRef = useRef(null)
  const configuratorSectionRef = useRef(null)
  const genderSectionRef = useRef(null)
  const heritageSectionRef = useRef(null)

  // Scroll ref is on the inner scroll container, separate from the section.
  // Previously both refs were on the same element — the section ref was overwritten.
  const scrollTrackRef = useRef(null)

  // Drag state tracked in refs to avoid unnecessary re-renders during pointer events.
  const isDraggingRef = useRef(false)
  const pointerStartXRef = useRef(0)
  const pointerStartScrollRef = useRef(0)

  // Tracks total drag distance so click-through on cards is suppressed after a real drag.
  const dragDistanceRef = useRef(0)

  const [isCollectionsVisible, setIsCollectionsVisible] = useState(false)
  const [isConfiguratorVisible, setIsConfiguratorVisible] = useState(false)

  const featured = collections.slice(0, 4)
  const watchInitialOrbit = '315deg 25deg auto'
  const isGenderInView = useInView(genderSectionRef, { once: true, margin: '-100px' })
  const isHeritageInView = useInView(heritageSectionRef, { once: true, margin: '-120px' })

  const genderImageHoverVariants = {
    hover: { scale: 1.06 },
  }

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

  const heritageItemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  }

  // IntersectionObserver triggers the stagger entrance animation once on first viewport entry.
  useEffect(() => {
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

  useEffect(() => {
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

  // Always restore State 1 on mount so the section starts from the composed baseline.
  useEffect(() => {
    if (!scrollTrackRef.current) return
    scrollTrackRef.current.scrollLeft = 0
  }, [])

  // Arrow buttons scroll the inner track by one card-width step.
  const scrollBy = (offset) => {
    scrollTrackRef.current?.scrollBy({ left: offset, behavior: 'smooth' })
  }

  // ── Pointer drag handlers ──────────────────────────────────────────────────
  // Supports mouse drag on desktop in addition to native touch/wheel scroll.

  const handlePointerDown = (e) => {
    if (!scrollTrackRef.current) return
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
    isDraggingRef.current = false
    scrollTrackRef.current?.releasePointerCapture?.(e.pointerId)
  }

  // Suppress link navigation if the pointer moved more than 8px — it was a drag, not a click.
  const handleCardClick = (e) => {
    if (dragDistanceRef.current > 8) {
      e.preventDefault()
    }
  }

  return (
    <div className="home-page">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="home-hero" aria-label="Van Der Linde luxury watches">
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

      {/* ── CONFIGURATOR CTA ─────────────────────────────────────────── */}
      <section
        id="configurator-cta"
        ref={configuratorSectionRef}
        className="home-configurator"
        aria-label="Configure your time"
      >
        <div className="home-configurator__inner">
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

      {/* ── GENDER SPLIT ───────────────────────────────────────────────── */}
      <section
        ref={genderSectionRef}
        className="home-gender"
        aria-label="Shop by gender"
      >
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

      {/* ── OUR HERITAGE (ABOUT) ───────────────────────────────────────── */}
      <section
        ref={heritageSectionRef}
        className="home-heritage"
        aria-label="Our heritage"
        style={{ '--home-heritage-bg': `url(${heritageImage})` }}
      >
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

      {/* TODO: New arrivals section */}
    </div>
  )
}