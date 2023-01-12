import { PrismaClient, Msg, Conversation } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'
import { Context } from 'graphql-ws/lib/server'

export interface Session {
  user?: User
}

export interface User {
  id: string
  username: string
}
/**
 * Server Configuration
 */
export interface GraphQLContext {
  session: Session | null
  prisma: PrismaClient
  pubsub: PubSub
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session
  }
}

export interface CreateUsernameResponse {
  success?: boolean
  error?: string
}

export interface SearchUsersResponse {
  users: Array<User>
}

/**
 * Messages
 */
export interface MsgFE extends Msg {
  id: string
  body: string
  sender: {
    id: string
    username: string
  }
  createdAt: Date
}

export interface SendMsgArgs {
  id: string
  conversationId: string
  senderId: string
  body: string
}

export interface SendMsgSubscriptionPayload {
  msgSend: MsgFE
}

/**
 * Conversations
 */
export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: NewConveration
}

export interface ConversationFE extends Conversation {
  participants: Array<ConversationParticipant>
  latestMsg: Msg | null
}

export interface ConversationParticipant {
  user: {
    id: string
    username: string | null
  }
}
export interface NewConveration extends Conversation {
  participants: Array<ConversationParticipant>
}
//------------------------------------------------------
export interface ConversationUpdatedSubscriptionData {
  conversationUpdated: ConversationFE;
}
