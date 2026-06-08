import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@/components/common/Button'
import { useLanguage } from '@/context/LanguageContext'
import { reviewService } from '@/services/reviewService'
import { reviewSchema } from '@/utils/validators'
import toast from 'react-hot-toast'
import './ReviewForm.css'

const initialValues = {
  rating: '',
  comment: '',
}

export default function ReviewForm({ watchId, onReviewSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reviewSchema),
    mode: 'onBlur',
    defaultValues: initialValues,
  })

  const submitReview = async (values) => {
    if (!watchId) return

    setIsSubmitting(true)
    try {
      const response = await reviewService.create(watchId, {
        rating: Number(values.rating),
        comment: values.comment.trim(),
      })
      reset(initialValues)
      toast.success(t('review.submitSuccess') || 'Review submitted!')
      if (onReviewSubmit) {
        onReviewSubmit(response?.data || response)
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit(submitReview)} noValidate>
      <div className="review-form__header">
        <p className="review-form__eyebrow">{t('review.addReview')}</p>
        <h3 className="review-form__title">{t('review.shareExperience')}</h3>
        <p className="review-form__subtitle">
          {t('review.subtitle')}
        </p>
      </div>

      <div className="review-form__grid">
        <div className="review-form__field review-form__field--full">
          <label className="review-form__label" htmlFor="reviewer-rating">
            {t('review.rating')} <span className="review-form__required">*</span>
          </label>
          <select
            id="reviewer-rating"
            name="rating"
            className="review-form__select"
            aria-invalid={Boolean(errors.rating)}
            aria-describedby={errors.rating ? 'review-rating-error' : undefined}
            {...register('rating')}
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
          {errors.rating && <p id="review-rating-error" className="review-form__error">{errors.rating.message}</p>}
        </div>

        <div className="review-form__field review-form__field--full">
          <label className="review-form__label" htmlFor="review-body">
            {t('review.review')} <span className="review-form__required">*</span>
          </label>
          <textarea
            id="review-body"
            name="comment"
            className="review-form__textarea"
            placeholder={t('review.bodyPlaceholder')}
            rows={4}
            aria-invalid={Boolean(errors.comment)}
            aria-describedby={errors.comment ? 'review-comment-error' : undefined}
            {...register('comment')}
          />
          {errors.comment && <p id="review-comment-error" className="review-form__error">{errors.comment.message}</p>}
        </div>
      </div>

      <div className="review-form__actions">
        <p className="review-form__note">{t('review.requiredFields')}</p>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : t('review.submit')}
        </Button>
      </div>
    </form>
  )
}
