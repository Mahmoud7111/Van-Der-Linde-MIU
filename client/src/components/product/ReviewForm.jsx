import { useState } from 'react'
import Button from '@/components/common/Button'
import './ReviewForm.css'

const initialValues = {
  name: '',
  rating: '',
  title: '',
  body: '',
}

export default function ReviewForm() {
  const [values, setValues] = useState(initialValues)

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
        <p className="review-form__eyebrow">Add a review</p>
        <h3 className="review-form__title">Share your experience</h3>
        <p className="review-form__subtitle">
          Help fellow collectors by sharing what you love about this timepiece.
        </p>
      </div>

      <div className="review-form__grid">
        <div className="review-form__field">
          <label className="review-form__label" htmlFor="reviewer-name">
            Name <span className="review-form__required">*</span>
          </label>
          <input
            id="reviewer-name"
            name="name"
            type="text"
            className="review-form__input"
            placeholder="Your name"
            value={values.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="review-form__field">
          <label className="review-form__label" htmlFor="reviewer-rating">
            Rating <span className="review-form__required">*</span>
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
              Select rating
            </option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} star{value > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="review-form__field review-form__field--full">
          <label className="review-form__label" htmlFor="review-title">
            Title <span className="review-form__required">*</span>
          </label>
          <input
            id="review-title"
            name="title"
            type="text"
            className="review-form__input"
            placeholder="Highlight your impression"
            value={values.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="review-form__field review-form__field--full">
          <label className="review-form__label" htmlFor="review-body">
            Review <span className="review-form__required">*</span>
          </label>
          <textarea
            id="review-body"
            name="body"
            className="review-form__textarea"
            placeholder="Share the details of your experience"
            rows={4}
            value={values.body}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="review-form__actions">
        <p className="review-form__note">* Required fields</p>
        <Button type="submit" variant="primary">
          Submit review
        </Button>
      </div>
    </form>
  )
}