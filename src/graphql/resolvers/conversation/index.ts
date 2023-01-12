import { createConversation, conversationRead } from './mutation'
import { conversations } from './query'
import { created, updated } from './subscription'
export { createConversation, conversationRead, conversations, created, updated }

export const subscriptionEvent = {
  conversationCreated: 'CONVERSATION_CREATED',
  conversationUpdated: 'CONVERSATION_UPDATED',
}
