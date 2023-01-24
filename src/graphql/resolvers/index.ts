import {
  createConversation,
  conversationRead,
  updateParticipants,
  deleteConversation,
  conversations,
  created,
  updated,
  deleted,
} from './conversation'
import { createUsername, searchUsers } from './user'
import { withFilter } from 'graphql-subscriptions'
import { msgs, sendMsg, send } from './msg'

export const resolvers = {
  Query: {
    create : () => {}
    // conversations, //
    // searchUsers, //
    // msgs, //
  },
  Mutation: {
    create : () => {}
    // deleteConversation,
    // updateParticipants,
    // createConversation,
    // conversationRead,
    // createUsername, //
    // sendMsg,
  },
  Subscription: {
    // conversationCreated: {
    //   subscribe: withFilter(created.Resolver, created.Filter),
    // },
    // msgSend: {
    //   subscribe: withFilter(send.Resolver, send.Filter), //
    // },
    // conversationUpdated: {
    //   subscribe: withFilter(updated.Resolver, updated.Filter),
    // },
    // conversationDeleted: {
    //   subscribe: withFilter(deleted.Resolver, deleted.Filter),
    // },
  },
}
