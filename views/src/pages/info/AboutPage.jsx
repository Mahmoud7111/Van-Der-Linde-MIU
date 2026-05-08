import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import Button from '@/components/common/Button'
import heritageImage from '@/assets/images/Photos/Heritage.avif'
import craftImage from '@/assets/images/Photos/About.png'
import beginningImage from '@/assets/images/Photos/Begining.png'
import movementImage from '@/assets/images/Photos/Automatic movement.webp'
import recognitionImage from '@/assets/images/Photos/Royal Recognition.jpg'
import './AboutPage.css'

export default function AboutPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" style={{ backgroundImage: `url(${heritageImage})` }}>
        <div className="about-hero__overlay"></div>
        <div className="about-hero__content">
          <Motion.span
            className="about-hero__label"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            ➤ SINCE 1875
          </Motion.span>
          <Motion.h1
            className="about-hero__title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.2 } } }}
          >
            A Legacy since <span className="modern-num">1875</span>
          </Motion.h1>
          <Motion.p
            className="about-hero__subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.4 } } }}
          >
            151 Years of Watchmaking Excellence
          </Motion.p>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="about-heritage">
        <div className="about-heritage__inner">
          <div className="about-heritage__text">
            <Motion.h2
              className="about-heritage__heading"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              A Tradition of Excellence
            </Motion.h2>
            <Motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.2 } } }}
            >
              Founded on the principles of classic horology, Van Der Linde has always stood for more than just telling time. We believe a watch is an heirloom, a statement of character, and a testament to the art of mechanical engineering.
            </Motion.p>
            <Motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.3 } } }}
            >
              For generations, our master watchmakers have blended traditional Swiss techniques with modern innovation to create timepieces that are as reliable as they are beautiful. Every dial, every gear, and every strap is meticulously selected and assembled by hand.
            </Motion.p>
          </div>
        </div>
      </section>

      {/* Craftsmanship Image Section */}
      <section className="about-craft-image">
        <div className="about-craft-image__wrapper">
          <img src={craftImage} alt="The Art of Watchmaking" className="about-craft__main-img" />
          <div className="about-craft-image__overlay">
            <Motion.div
              className="about-craft-image__content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1, ease: "easeOut" }
                }
              }}
            >
              <h2 className="about-craft-image__headline">Where Time Becomes Art</h2>
              <p className="about-craft-image__text">
                Rooted in tradition and driven by innovation, every piece tells a story of craftsmanship passed down through generations.
              </p>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="about-craft">
        <div className="about-craft__content">
          <Motion.h2
            className="about-craft__title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            The Art of Watchmaking
          </Motion.h2>
          <div className="about-craft__grid">
            <Motion.div
              className="about-craft__card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.2 } } }}
            >
              <h3>Precision Engineering</h3>
              <p>Our movements are crafted to exact tolerances, ensuring unparalleled accuracy and longevity. Each caliber undergoes rigorous testing before it ever reaches your wrist.</p>
            </Motion.div>
            <Motion.div
              className="about-craft__card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.4 } } }}
            >
              <h3>Finest Materials</h3>
              <p>From aerospace-grade titanium and 18k gold to scratch-resistant sapphire crystal, we source only the finest materials to ensure your timepiece withstands the test of time.</p>
            </Motion.div>
            <Motion.div
              className="about-craft__card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.6 } } }}
            >
              <h3>Timeless Design</h3>
              <p>We reject fleeting trends in favor of enduring aesthetics. A Van Der Linde watch is designed to look as striking today as it will fifty years from now.</p>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Beginning Section */}
      <section className="about-milestone about-milestone--image-left">
        <div className="about-milestone__inner">
          <Motion.div
            className="about-milestone__image-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <img src={beginningImage} alt="The Beginning of Van Der Linde" className="about-milestone__image" />
          </Motion.div>
          <Motion.div
            className="about-milestone__text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.2 } } }}
          >
            <h2 className="about-milestone__heading">Our Humble Origins</h2>
            <p>
              The story of Van Der Linde began in a small, moonlit workshop in Geneva. Driven by a singular vision to capture the essence of time itself, our founder began hand-assembling movements that would eventually set the gold standard for horological excellence. What started as a pursuit of perfection by a lone craftsman has blossomed into a global legacy.
            </p>
          </Motion.div>
        </div>
      </section>

      {/* Movement Section */}
      <section className="about-milestone about-milestone--image-right">
        <div className="about-milestone__inner">
          <Motion.div
            className="about-milestone__text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="about-milestone__heading">The Automatic Revolution</h2>
            <p>
              In the early 20th century, we pioneered one of the first reliable automatic winding mechanisms. This breakthrough allowed our timepieces to be powered by the natural motion of the wearer, eliminating the need for daily winding. It was a fusion of mechanical ingenuity and effortless luxury that redefined what a luxury watch could be.
            </p>
          </Motion.div>
          <Motion.div
            className="about-milestone__image-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.2 } } }}
          >
            <img src={movementImage} alt="Automatic Movement Innovation" className="about-milestone__image" />
          </Motion.div>
        </div>
      </section>

      {/* Royal Recognition Section */}
      <section className="about-milestone about-milestone--image-left">
        <div className="about-milestone__inner">
          <Motion.div
            className="about-milestone__image-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <img src={recognitionImage} alt="Royal Recognition" className="about-milestone__image" />
          </Motion.div>
          <Motion.div
            className="about-milestone__text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { ...fadeInUp.visible.transition, delay: 0.2 } } }}
          >
            <h2 className="about-milestone__heading">A Royal Legacy</h2>
            <p>
              Our commitment to excellence eventually caught the attention of European royalty. Van Der Linde became the choice of monarchs and statesmen, commissioned to create bespoke timepieces for coronation ceremonies and royal gifts. This period cemented our position as a symbol of status, power, and refined taste across the continent.
            </p>
          </Motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <Motion.section
        className="about-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="about-cta__title">Experience the Collection</h2>
        <p className="about-cta__text">Discover the perfect timepiece that speaks to your legacy.</p>
        <Button to="/shop" variant="primary">Explore Watches</Button>
      </Motion.section>
    </div>
  )
}
