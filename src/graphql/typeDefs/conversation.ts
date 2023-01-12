import gql from 'graphql-tag'

export const conversationTypeDefs = gql`
  type CreateConversationResponse {
    conversationId: String
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
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]!): CreateConversationResponse
  }

  type Mutation {
    conversationRead(userId: String!, conversationId: String!): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
  }
  type Subscription {
    conversationUpdated: Conversation
  }
`
