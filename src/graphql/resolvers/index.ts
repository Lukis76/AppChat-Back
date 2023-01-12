import {
  createConversation,
  conversationRead,
  deletedConversation,
  conversations,
  created,
  updated,
} from "./conversation";
import { createUsername, searchUsers } from "./user";
import { withFilter } from "graphql-subscriptions";
import { msgs, sendMsg, send } from "./msg";

export const resolvers = {
  Query: {
    conversations,
    searchUsers,
    msgs,
  },
  Mutation: {
    deletedConversation,
    createConversation,
    conversationRead,
    createUsername,
    sendMsg,
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(created.Resolver, created.Filter),
    },
    msgSend: {
      subscribe: withFilter(send.Resolver, send.Filter),
    },
    conversationUpdated: {
      subscribe: withFilter(updated.Resolver, updated.Filter),
    },
  },
};
