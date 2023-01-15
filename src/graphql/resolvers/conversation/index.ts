import {
  createConversation,
  conversationRead,
  deleteConversation,
  updateParticipants

} from './mutation'
import { conversations } from './query'
import { created, updated, deleted } from './subscription'
export {
  createConversation,
  updateParticipants,
  conversationRead,
  deleteConversation,
  conversations,
  created,
  updated,
  deleted,
}

export const subscriptionEvent = {
  conversationCreated: 'CONVERSATION_CREATED',
  conversationUpdated: 'CONVERSATION_UPDATED',
  conversationDeleted: 'CONVERSATION_DELETED',
}
