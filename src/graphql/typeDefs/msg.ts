import gql from "graphql-tag";

export const msgTypeDefs = gql`
  scalar Date

  type Msg {
    id: String
    sender: User
    body: String
    createdAt: Date
  }

  type Query {
    msgs(conversationId: String, token: String): [Msg]
  }

  type Mutation {
    sendMsg(id: String, conversationId: String, senderId: String, body: String): Boolean
  }

  type Subscription {
    msgSend(conversationId: String): Msg
  }
`;
