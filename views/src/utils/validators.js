/**
 * Validation schemas built with Yup.
 *
 * What this file is:
 * Centralized form validation rules for authentication, checkout, reviews, and contact forms.
 *
 * What it does:
 * Exports reusable Yup schemas so each form can attach validation using `yupResolver`.
 *
 * Where it is used:
 * Imported in form components/pages such as LoginPage, RegisterPage, ShippingForm,
 * Review form components, and ContactPage forms.
 */
import * as yup from 'yup'

const nameRule = (label) =>
  yup
    .string()
    .transform((value) => (typeof value === 'string' ? value.trim() : ''))
    .min(2, `${label} must be at least 2 characters`)
    .max(80, `${label} must be 80 characters or less`)
    .required(`${label} is required`)

const emailRule = yup
  .string()
  .transform((value) => (typeof value === 'string' ? value.trim().toLowerCase() : ''))
  .email('Please enter a valid email')
  .required('Email is required')

const phoneRule = yup
  .string()
  .transform((value) => (typeof value === 'string' ? value.trim() : ''))
  .matches(/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number')

// Used by LoginPage form with react-hook-form + yupResolver.
export const loginSchema = yup.object({
  // Require a valid email format to align with backend auth input expectations.
  email: emailRule,
  // Password minimum length keeps basic credential quality and matches backend constraints.
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})


// Used by RegisterPage form with react-hook-form + yupResolver.
export const registerSchema = yup.object({
// First name is required for profile identity.
  firstName: nameRule('First name'),
  // Last name is required for profile identity.
  lastName: nameRule('Last name'),

  // Phone is optional but must be valid when provided.
  phone: yup
    .string()
    .transform((value) => (typeof value === 'string' ? value.trim() : ''))
    .test('phone-format', 'Please enter a valid phone number', (value) => {
      if (!value) return true
      return /^\+?[0-9\s\-()]{7,20}$/.test(value)
    }),
  // Email validation prevents malformed addresses before request submission.
  email: emailRule,
  // Password rule mirrors login expectations and backend validation.
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  // Confirm password must exactly match password using Yup ref binding.
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),

  // Optional demographic fields.
  dateOfBirth: yup.string().nullable(),
  gender: yup
    .string()
    .oneOf(['', 'male', 'female'], 'Please select a valid option')
    .nullable(),
  interests: yup.array().of(yup.string()).default([]),
  // Terms agreement is required before account creation.
  agree: yup
    .boolean()
    .oneOf([true], 'You must agree to the Terms & Conditions and Privacy Policy'),
})


// Used by ForgotPasswordPage with react-hook-form + yupResolver.
export const forgotPasswordSchema = yup.object({
  email: emailRule,
})

// Used by ResetPasswordPage with react-hook-form + yupResolver.
export const resetPasswordSchema = yup.object({
  resetToken: yup.string().trim().required('Reset token is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
})


// Used by checkout ShippingForm with react-hook-form + yupResolver.
export const shippingSchema = yup.object({
  // Collects receiver's full name for delivery labels.
  fullName: nameRule('Full name'),
  // Required so order confirmations and shipping updates can be sent.
  email: emailRule,
  // Required phone for courier contact during last-mile delivery.
  phone: phoneRule.required('Phone is required'),
  // Street line for precise shipment destination.
  street: yup.string().trim().min(5, 'Street must be at least 5 characters').required('Street is required'),
  // City is mandatory for delivery logistics.
  city: yup.string().trim().min(2, 'City must be at least 2 characters').required('City is required'),
  // Country supports regional shipping rules and tax calculations.
  country: yup.string().trim().min(2, 'Country must be at least 2 characters').required('Country is required'),
  // ZIP/Postal code supports carrier routing.
  zip: yup.string().trim().matches(/^[A-Za-z0-9\s-]{3,12}$/, 'Please enter a valid postal code').required('ZIP code is required'),
})


// Used by review submission forms on product detail pages.
export const reviewSchema = yup.object({
  // Rating must be between 1 and 5 to align with star-rating UI and backend model.
  rating: yup
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .required('Rating is required'),
  // Review text minimum keeps feedback meaningful.
  comment: yup
    .string()
    .trim()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must be 1000 characters or less')
    .required('Comment is required'),
})


// Used by ContactPage support form with react-hook-form + yupResolver.
export const contactSchema = yup.object({
  // Sender name for personalized support responses.
  name: nameRule('Name'),
  // Sender email for follow-up communication.
  email: emailRule,
  // Subject line for routing contact tickets.
  subject: yup.string().required('Subject is required'),
  // Message body minimum ensures enough context for support team triage.
  message: yup
    .string()
    .trim()
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message must be 1000 characters or less')
    .required('Message is required'),
})
