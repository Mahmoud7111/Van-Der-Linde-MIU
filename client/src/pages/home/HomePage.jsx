/**
 * HomePage
 * Hero-first homepage scaffold for Van Der Linde with TODO placeholders for upcoming sections.
 */
import { Link } from 'react-router-dom'
import heroVideo from '@/assets/Assets/videos/hero.mp4'
import '@/pages/home/HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero" aria-label="Van Der Linde luxury watches">
        <video
          className="home-hero__video"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          {/* Importing from src ensures Vite fingerprints and serves the video correctly. */}
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Keeps text legible while preserving visibility of the hero footage. */}
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
          <Link className="home-hero__cta" to="/shop">
            Discover More
          </Link>
        </div>
      </section>

      {/* TODO: Featured collections section */}
      {/* TODO: New arrivals section */}
      {/* TODO: Heritage section */}
    </div>
  )
}
