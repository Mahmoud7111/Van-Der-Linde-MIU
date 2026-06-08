/**
 * Chatbot service.
 * Sends user message to Gemini via backend and returns reply string.
 */
import { apiPost } from '@/services/http'

export const chatbotService = {
  sendMessage: (message, pageUrl, history = []) =>
    apiPost('/chatbot/message', { message, pageUrl, history }).then((data) => data.reply),
}
