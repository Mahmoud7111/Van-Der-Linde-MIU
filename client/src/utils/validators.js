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

// Used by LoginPage form with react-hook-form + yupResolver.
export const loginSchema = yup.object({
  // Require a valid email format to align with backend auth input expectations.
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  // Password minimum length keeps basic credential quality and matches backend constraints.
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})


// Used by RegisterPage form with react-hook-form + yupResolver.
export const registerSchema = yup.object({
// First name is required for profile identity.
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  // Last name is required for profile identity.
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),

  // Phone is optional but must be valid when provided.
  phone: yup
    .string()
    .nullable()
    .transform((value) => (value ? value.trim() : ''))
    .test('phone-format', 'Please enter a valid phone number', (value) => {
      if (!value) return true
      return /^[+\d\s\-()]{7,20}$/.test(value)
    }),
  // Email validation prevents malformed addresses before request submission.
  email: yup.string().email('Please enter a valid email').required('Email is required'),
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
})

// Optional demographic fields.
  dateOfBirth: yup.string().nullable(),
  gender: yup
    .string()
    .oneOf(['', 'male', 'female', 'prefer_not_to_say'], 'Please select a valid option')
    .nullable(),
  interests: yup.array().of(yup.string()).default([]),
  // Terms agreement is required before account creation.
  agree: yup
    .boolean()
    .oneOf([true], 'You must agree to the Terms & Conditions and Privacy Policy'),
})


// Used by ForgotPasswordPage with react-hook-form + yupResolver.
export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
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
  fullName: yup.string().required('Full name is required'),
  // Required so order confirmations and shipping updates can be sent.
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  // Required phone for courier contact during last-mile delivery.
  phone: yup.string()
  .matches(/^[+\d\s\-()]{7,20}$/, 'Please enter a valid phone number')
  .required('Phone is required'),
  // Street line for precise shipment destination.
  street: yup.string().required('Street is required'),
  // City is mandatory for delivery logistics.
  city: yup.string().required('City is required'),
  // Country supports regional shipping rules and tax calculations.
  country: yup.string().required('Country is required'),
  // ZIP/Postal code supports carrier routing.
  zip: yup.string().required('ZIP code is required'),
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
    .min(10, 'Comment must be at least 10 characters')
    .required('Comment is required'),
})


// Used by ContactPage support form with react-hook-form + yupResolver.
export const contactSchema = yup.object({
  // Sender name for personalized support responses.
  name: yup.string().required('Name is required'),
  // Sender email for follow-up communication.
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  // Subject line for routing contact tickets.
  subject: yup.string().required('Subject is required'),
  // Message body minimum ensures enough context for support team triage.
  message: yup
    .string()
    .min(20, 'Message must be at least 20 characters')
    .required('Message is required'),
})
