import { useState } from 'react'
import Button from '@/components/common/Button'
import { useLanguage } from '@/context/LanguageContext'
import './ReviewForm.css'

const initialValues = {
  name: '',
  rating: '',
  title: '',
  body: '',
}

export default function ReviewForm() {
  const [values, setValues] = useState(initialValues)
  const { t } = useLanguage()

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setValues(initialValues)
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form__header">
        <p className="review-form__eyebrow">{t('review.addReview')}</p>
        <h3 className="review-form__title">{t('review.shareExperience')}</h3>
        <p className="review-form__subtitle">
          {t('review.subtitle')}
        </p>
      </div>

      <div className="review-form__grid">
        <div className="review-form__field">
          <label className="review-form__label" htmlFor="reviewer-name">
            {t('review.name')} <span className="review-form__required">*</span>
          </label>
          <input
            id="reviewer-name"
            name="name"
            type="text"
            className="review-form__input"
            placeholder={t('review.yourName')}
            value={values.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="review-form__field">
          <label className="review-form__label" htmlFor="reviewer-rating">
            {t('review.rating')} <span className="review-form__required">*</span>
          </label>
          <select
            id="reviewer-rating"
            name="rating"
            className="review-form__select"
            value={values.rating}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              {t('review.selectRating')}
            </option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value === 1 ? t('review.oneStar') : t('review.stars', { count: value })}
              </option>
            ))}
          </select>
        </div>

        <div className="review-form__field review-form__field--full">
          <label className="review-form__label" htmlFor="review-title">
            {t('review.title')} <span className="review-form__required">*</span>
          </label>
          <input
            id="review-title"
            name="title"
            type="text"
            className="review-form__input"
            placeholder={t('review.titlePlaceholder')}
            value={values.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="review-form__field review-form__field--full">
          <label className="review-form__label" htmlFor="review-body">
            {t('review.review')} <span className="review-form__required">*</span>
          </label>
          <textarea
            id="review-body"
            name="body"
            className="review-form__textarea"
            placeholder={t('review.bodyPlaceholder')}
            rows={4}
            value={values.body}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="review-form__actions">
        <p className="review-form__note">{t('review.requiredFields')}</p>
        <Button type="submit" variant="primary">
          {t('review.submit')}
        </Button>
      </div>
    </form>
  )
}
