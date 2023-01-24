import { PrismaClient, Msg, Conversation, ConversationParticipant } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";

//--------------------------
export interface Session {
  user?: User;
}
//--------------------------

export interface User {
  id: string;
  username: string;
}
//-------------------------
/**
 * Server Configuration
 */
//---------------------------------
export interface GraphQLContext {
  session: string | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}
//-----------------------------------------------------

export interface SubscriptionContext extends Context {
  connectionParams: {
    authToken?: string | null;
  };
}
//----------------------------------------

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}
//-------------------------------------

export interface SearchUsersResponse {
  users: Array<User>;
}
//-------------------------------------

/**
 * Messages
 */
//-----------------------------------
export interface MsgFE extends Msg {
  id: string;
  body: string;
  sender: {
    id: string;
    username: string;
  };
  createdAt: Date;
}
//-----------------------------

export interface SendMsgArgs {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}
//--------------------------------------------

export interface SendMsgSubscriptionPayload {
  msgSend: MsgFE;
}
//--------------------------------------------

/**
 * Conversations
 */

//-----------------------------------------------------
export interface ConversationCreatedSubscriptionData {
  conversationCreated: NewConveration;
}
//-----------------------------------------------------

export interface ConversationFE extends Conversation {
  participants: Array<ConversationParticipantUser>;
  latestMsg: Msg | null;
}
//-----------------------------------------------------

export interface ConversationParticipantUser {
  user: {
    id: string;
    username: string;
  };
}
//-----------------------------------------------------
export interface NewConveration extends Conversation {
  participants: Array<ConversationParticipantUser>;
}
//-----------------------------------------------------
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
//-----------------------------------------------------
export interface ConversationDeletedSubscriptionData {
  conversationDeleted: Conversation & {
    participants: Array<ConversationParticipant>;
  };
}
//-----------------------------------------------------
