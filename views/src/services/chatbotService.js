/**
 * Chatbot service.
 * Sends user message to the backend catalog assistant and returns reply string.
 */
import { apiPost } from '@/services/http'

export const chatbotService = {
    sendMessage: (message, pageUrl) =>
        apiPost('/chatbot/message', { message, pageUrl })
            .then((data) => data.reply),
}
