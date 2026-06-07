/**
 * Chatbot service.
 * Sends user message to Gemini via backend and returns reply string.
 */
import { apiPost } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'

const mock = {
  sendMessage: (_message, _pageUrl, _history) =>
    Promise.resolve(
      'Welcome to Van Der Linde. I can help you explore our collections, find the perfect timepiece, or answer any questions about our brand. How can I assist you?'
    ),
}

const real = {
  // Returns the reply string directly. history is Gemini-format: [{ role, parts: [{ text }] }]
  sendMessage: (message, pageUrl, history = []) =>
    apiPost('/chatbot/message', { message, pageUrl, history })
    .then((data) => data.reply),
}

export const chatbotService = USE_MOCK ? mock : real
