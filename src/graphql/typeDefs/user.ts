import gql from 'graphql-tag'

export const userTypeDefs = gql`
  type User {
    id: String
    name: String
    username: String
    email: String
    emailVerified: Boolean
    image: String
  }

  type SearchUser {
    id: String
    username: String
  }

  type Query {
    searchUsers(username: String!): [SearchUser]
  }

  type Mutation {
    createUsername(username: String!): CreateUsernameResponse
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`
