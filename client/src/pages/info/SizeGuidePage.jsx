import { motion as Motion } from 'framer-motion'
import './SizeGuidePage.css'

export default function SizeGuidePage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="size-guide-page">
      <Motion.header 
        className="size-guide-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="size-guide-header__title">Size Guide</h1>
        <p className="size-guide-header__subtitle">Finding the perfect fit for your wrist.</p>
      </Motion.header>

      <Motion.section 
        className="size-guide-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="size-guide-section__title">Case Diameters</h2>
        <div className="size-table-wrapper">
          <table className="size-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Diameter (mm)</th>
                <th>Wrist Circumference Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Small</td>
                <td>34mm - 36mm</td>
                <td>14cm - 16cm (6.0" - 6.3")</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>38mm - 40mm</td>
                <td>16cm - 18cm (6.3" - 7.1")</td>
              </tr>
              <tr>
                <td>Large</td>
                <td>42mm - 44mm</td>
                <td>18cm - 20cm (7.1" - 7.9")</td>
              </tr>
              <tr>
                <td>Extra Large</td>
                <td>46mm+</td>
                <td>20cm+ (7.9"+)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Motion.section>

      <Motion.section 
        className="size-guide-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="size-guide-section__title">Strap Widths</h2>
        <div className="size-guide-grid">
          <div className="size-visual">
            <h3 className="size-table-th">Common Widths</h3>
            <table className="size-table">
              <thead>
                <tr>
                  <th>Case Size</th>
                  <th>Lug Width</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>36mm Case</td>
                  <td>18mm</td>
                </tr>
                <tr>
                  <td>40mm Case</td>
                  <td>20mm</td>
                </tr>
                <tr>
                  <td>42mm Case</td>
                  <td>22mm</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="size-visual">
            <h3 className="size-table-th">How to Measure</h3>
            <p className="size-visual__text">
              To find your lug width, measure the distance between the two lugs (the "arms" of the watch case) using a metric ruler. This distance is the width of the strap you will need.
            </p>
          </div>
        </div>
      </Motion.section>
    </div>
  )
}
