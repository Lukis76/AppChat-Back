import {
  createConversation,
  conversationRead,
  updateParticipants,
  deleteConversation,
  conversations,
  created,
  updated,
  deleted,
} from "./conversation";
import { withFilter } from "graphql-subscriptions";
import { msgs, sendMsg, send } from "./msg";
import {
  registerUser,
  loginUser,
  updateUsername,
  searchUsers,
  refresh,
} from "./user";

export const resolvers = {
  Query: {
    conversations, //
    searchUsers, //
    msgs, //
    refresh,
  },
  Mutation: {
    deleteConversation,
    updateParticipants,
    createConversation,
    conversationRead,
    updateUsername, //
    sendMsg,
    loginUser,
    registerUser,
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(created.Resolver, created.Filter),
    },
    msgSend: {
      subscribe: withFilter(send.Resolver, send.Filter), //
    },
    conversationUpdated: {
      subscribe: withFilter(updated.Resolver, updated.Filter),
    },
    conversationDeleted: {
      subscribe: withFilter(deleted.Resolver, deleted.Filter),
    },
  },
};
