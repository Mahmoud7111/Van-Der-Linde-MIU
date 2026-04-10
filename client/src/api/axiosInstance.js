/**
 * Axios instance for all HTTP communication.
 *
 * What this file is:
 * A preconfigured axios client shared by every service module.
 *
 * //? why we use it:
 *  Imagine in the watchService, we need to fetch the list of watches from the backend.
 *  Instead of writing something like this in watchService:
 *  
    axios.get('http://localhost:5000/api/watches', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
 *
    ->You're copy-pasting the same two things every single time:

    The full URL http://localhost:5000/api
    The token header logic

    Now imagine your backend URL changes, or the token is stored under a different key. You have to hunt down and fix every single file. That's the "20 places" problem.


    The "Good" Way (with axiosInstance) ->
    You define the URL and token logic once in axiosInstance.js, and now every service just does:

    // watchService.js
    api.get('/watches')   // token added automatically, URL prepended automatically

 * What it does:
 * - Uses a single baseURL from environment-aware constants.
 * - Adds JWT token automatically on every outgoing request.
 * - Handles 401 responses globally by clearing stale auth and redirecting to login.
 *
 * Where it is used:
 * Imported by authService, watchService, and orderService. Components must never call axios directly.
 */
import axios from 'axios'
import { API_URL } from '@/utils/constants' // Centralized flag to toggle between mock and real services across the app.

// axios.create() makes a custom axios instance with pre-set settings.
const api = axios.create({
  // baseURL means every request automatically gets this URL prepended. So when a service calls api.get('/watches'), axios actually sends to http://localhost:5000/api/watches. You never type the full URL again.
  baseURL: API_URL,
})

// Request interceptor is a function that runs runs before every single request automatically.
api.interceptors.request.use(
  (config) => { //config is the full description of the request about to be sent (URL, method, headers, body, etc.).
    // Read persisted token from localStorage so authenticated requests include JWT.
    const token = localStorage.getItem('token') //localStorage is the browser's built-in key-value storage that survives page refresh. When a user logs in, their JWT token gets saved there. This line reads it back out.

    // If a token exists, attach it to the request headers as Bearer auth header.
    //The backend reads this header to know who is making the request
    //Bearer is just the standard prefix for JWT tokens - the backend expects exactly that format.
    if (token) {
      // Ensure headers object exists before assigning Authorization.
      config.headers = config.headers || {} //a safety check: if headers doesn't exist yet, create an empty object before trying to add to it.
      config.headers.Authorization = `Bearer ${token}` //This line adds the Authorization header to the request, with the value "Bearer <
    }

    // Return the updated config so axios can continue with the request. //You must return the config, otherwise axios doesn't know what to send
    return config
  },
  (error) => {
    // where something goes wrong before the request even sends (e.g. bad config). Promise.reject(error) passes the error along to whoever called the service, so they can handle it.
    return Promise.reject(error)
  }
)

// Runs after  every response comes back from the server.
api.interceptors.response.use(
  (response) => {
    // Pass successful responses through unchanged.
    return response
  },
  (error) => {
    // Extract status safely in case error shape differs by network condition.
    const statusCode = error?.response?.status

    // HTTP 401 means Unauthorized - the server is saying "I don't recognize you, or your token is expired/invalid." This is the JWT expiry scenario.
    if (statusCode === 401) {
      // Remove invalid token so future requests do not repeat unauthorized calls.
      localStorage.removeItem('token')

      // Redirect to login page globally so individual components do not handle JWT expiry themselves.
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      //typeof window !== 'undefined' - makes sure this code is running in a browser, not in a server-side rendering environment where window doesn't exist
      //window.location.pathname !== '/login' - prevents an infinite redirect loop. If you're already on /login and the login request itself returns 401, you don't want to redirect to /login again forever
      // Then window.location.href = '/login' does a hard redirect to the login page.
    }

    // Re-throw error so callers can still show contextual UI messages.
    return Promise.reject(error)
  }
)

// Export shared axios instance for all service files.
export default api


/*
The Big Picture
Component (ProductCard)
    ↓ calls
watchService.getAll()
    ↓ calls
api.get('/watches')         <- your axiosInstance
    ↓ interceptor adds token automatically
Backend receives request with Authorization header
    ↓ returns data
Interceptor passes response through
    ↓
watchService returns data to component
*/
