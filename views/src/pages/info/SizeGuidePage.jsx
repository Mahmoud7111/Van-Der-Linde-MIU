import { motion as Motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import './SizeGuidePage.css'

export default function SizeGuidePage() {
  const { t } = useLanguage()
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
        <h1 className="size-guide-header__title">{t('size.title')}</h1>
        <p className="size-guide-header__subtitle">{t('size.subtitle')}</p>
      </Motion.header>

      <Motion.section 
        className="size-guide-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="size-guide-section__title">{t('size.caseDiameters')}</h2>
        <div className="size-table-wrapper">
          <table className="size-table">
            <thead>
              <tr>
                <th>{t('size.size')}</th>
                <th>{t('size.diameter')}</th>
                <th>{t('size.wrist')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('size.small')}</td>
                <td>34mm - 36mm</td>
                <td>14cm - 16cm (6.0" - 6.3")</td>
              </tr>
              <tr>
                <td>{t('size.medium')}</td>
                <td>38mm - 40mm</td>
                <td>16cm - 18cm (6.3" - 7.1")</td>
              </tr>
              <tr>
                <td>{t('size.large')}</td>
                <td>42mm - 44mm</td>
                <td>18cm - 20cm (7.1" - 7.9")</td>
              </tr>
              <tr>
                <td>{t('size.extraLarge')}</td>
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
        <h2 className="size-guide-section__title">{t('size.strapWidths')}</h2>
        <div className="size-guide-grid">
          <div className="size-visual">
            <h3 className="size-table-th">{t('size.commonWidths')}</h3>
            <table className="size-table">
              <thead>
                <tr>
                  <th>{t('size.caseSize')}</th>
                  <th>{t('size.lugWidth')}</th>
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
            <h3 className="size-table-th">{t('size.howMeasure')}</h3>
            <p className="size-visual__text">
              {t('size.measureText')}
            </p>
          </div>
        </div>
      </Motion.section>
    </div>
  )
}
