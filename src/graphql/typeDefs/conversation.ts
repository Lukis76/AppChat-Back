import gql from "graphql-tag";

export const conversationTypeDefs = gql`
  scalar Date

  type CreateConversationResponse {
    conversationId: String
  }

  type ConversationDeletedSubscriptionPayload {
    id: String
  }

  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
    addUserIds: [String]
    removeUserIds: [String]
  }

  type Conversation {
    id: String
    latestMsg: Msg
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMsg: Boolean
  }

  type Query {
    conversations(token: String): [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]!): CreateConversationResponse
  }

  type Mutation {
    conversationRead(userId: String!, conversationId: String!): Boolean
  }

  type Mutation {
    deleteConversation(conversationId: String!): Boolean
  }

  type Mutation {
    leaveConversation(conversationId: String!): Boolean
  }

  type Mutation {
    updateParticipants(conversationId: String!, participantIds: [String]!): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
  }

  type Subscription {
    conversationUpdated: ConversationUpdatedSubscriptionPayload
  }

  type Subscription {
    conversationDeleted: ConversationDeletedSubscriptionPayload
  }
`;
