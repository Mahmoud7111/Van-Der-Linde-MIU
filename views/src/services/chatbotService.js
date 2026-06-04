/**
 * Chatbot service.
 * Sends user message to Gemini via backend and returns reply string.
 */
import { apiPost } from '@/services/http'
import { USE_MOCK } from '@/utils/constants'

const mock = {
  sendMessage: (_message, _pageUrl) =>
    Promise.resolve(
      'Welcome to Van Der Linde. I can help you explore our collections, find the perfect timepiece, or answer any questions about our brand. How can I assist you?'
    ),
}

const real = {
  // Returns the reply string directly, not the full response object.
  sendMessage: (message, pageUrl) =>
    apiPost('/chatbot/message', { message, pageUrl }).then((data) => data.reply),
}

export const chatbotService = USE_MOCK ? mock : real
