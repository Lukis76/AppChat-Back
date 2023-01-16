import { PrismaClient, Msg, Conversation, ConversationParticipant } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";

export interface Session {
  user?: User;
}

export interface User {
  id: string;
  username: string;
}
/**
 * Server Configuration
 */
export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface SearchUsersResponse {
  users: Array<User>;
}

/**
 * Messages
 */
export interface MsgFE extends Msg {
  id: string;
  body: string;
  sender: {
    id: string;
    username: string;
  };
  createdAt: Date;
}

export interface SendMsgArgs {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface SendMsgSubscriptionPayload {
  msgSend: MsgFE;
}

/**
 * Conversations
 */
export interface ConversationCreatedSubscriptionData {
  conversationCreated: NewConveration;
}

export interface ConversationFE extends Conversation {
  participants: Array<ConversationParticipantUser>;
  latestMsg: Msg | null;
}

export interface ConversationParticipantUser {
  user: {
    id: string;
    username: string;
  };
}
export interface NewConveration extends Conversation {
  participants: Array<ConversationParticipantUser>;
}
//------------------------------------------------------
export interface ConversationUpdatedSubscriptionData {
  conversationUpdated: {
    conversation: {
      participants: Array<ConversationParticipant>;
      latestMsg: Msg | null;
    };
    addUserIds: Array<string>;
    removeUserIds: Array<string>;
  };
}
//--------------------------------------------------------
export interface ConversationDeletedSubscriptionData {
  conversationDeleted: Conversation & {
    participants: Array<ConversationParticipant>;
  };
}
// backend

// BASE_URL=http://localhost:3000
// MONGODB_URI=mongodb+srv://lucas:67p6L2BVKoZGeFeK@cluster0.6uhshd9.mongodb.net/ChatGraphQl
// RUST_BACKTRACE=full

//fontend

// GOOGLE_CLIENT_ID="999338956671-nuh47jljiadc26fm870tf1p27qkubh9e.apps.googleusercontent.com"
// GOOGLE_CLIENT_SECRET="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"
// MONGODB_URI="mongodb+srv://lucas:67p6L2BVKoZGeFeK@cluster0.6uhshd9.mongodb.net/ChatGraphQl"
// NEXTAUTH_SECRET="LQZWmi6PNX9XKdN7ZI0EadKccqa30E2FdSBvk1HlBtc="
// NEXTAUTH_URL="http://localhost:3000"
// GRAPHQL_URI="http://localhost:4000/graphql"
