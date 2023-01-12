import {
  createConversation,
  conversationRead,
  deletedConversation,
} from "./mutation";
import { conversations } from "./query";
import { created, updated } from "./subscription";
export {
  createConversation,
  conversationRead,
  deletedConversation,
  conversations,
  created,
  updated,
};

export const subscriptionEvent = {
  conversationCreated: "CONVERSATION_CREATED",
  conversationUpdated: "CONVERSATION_UPDATED",
  conversationDeleted: "CONVERSATION_DELETED",
};
