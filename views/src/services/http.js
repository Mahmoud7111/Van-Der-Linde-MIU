/**
 * API layer — fetch wrapper.
 *
 * What this file is:
 * The single HTTP client for the entire frontend. Replaces axiosInstance.
 *
 * What it does:
 * - Unwraps the { success, message, data } envelope from every response.
 * - Sends credentials (httpOnly cookie) automatically on every request.
 * - Handles 401 globally by redirecting to /login, except for /auth/me
 *   which is called on app load to restore session — a 401 there just means
 *   the user is not logged in, not that they need to be kicked out.
 * - Provides separate helpers for JSON requests and file uploads.
 *
 * Where it is used:
 * Imported by every service file. Never imported directly in components.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Unwraps envelope, handles errors, triggers 401 redirect when appropriate.
const handleResponse = async (res, endpoint) => {
  const data = await res.json()

  if (!res.ok) {
    // 401 on /auth/me means session expired or user is a guest — handle silently in AuthContext.
    // 401 on any other protected route means token is gone — redirect to login.
    if (res.status === 401 && !endpoint.includes('/auth/me')) {
      window.location.href = '/login'
    }

    const err = new Error(data.message || 'Request failed')
    err.statusCode = res.status
    throw err
  }

  // Return the unwrapped data payload directly.
  // Backend always returns { success, message, data } — callers only care about data.
  return data.data
}

// Core request builder — used by all method helpers below.
const request = async (method, endpoint, body = null) => {
  const options = {
    method,
    credentials: 'include', // sends httpOnly cookie automatically on every request
    headers: { 'Content-Type': 'application/json' },
  }

  if (body !== null) {
    options.body = JSON.stringify(body)
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options)
  return handleResponse(res, endpoint)
}

// File upload helper — does NOT set Content-Type so browser can set it with
// the correct multipart boundary for FormData.
const upload = async (endpoint, formData) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    body: formData, // FormData — browser sets Content-Type automatically
  })
  return handleResponse(res, endpoint)
}

export const apiGet = (endpoint) => request('GET', endpoint)
export const apiPost = (endpoint, body) => request('POST', endpoint, body)
export const apiPut = (endpoint, body) => request('PUT', endpoint, body)
export const apiDelete = (endpoint) => request('DELETE', endpoint)
export const apiUpload = (endpoint, formData) => upload(endpoint, formData)