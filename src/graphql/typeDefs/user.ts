import gql from "graphql-tag";

export const userTypeDefs = gql`

  type SearchUser {
    id: String
    email: String
    username: String
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }

  type User {
    id: String
    username: String
    email: String
    image: String
    token: String
  }

  input RegisterInput {
    username: String
    email: String
    password: String
    confirmPassword: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type TimeOut {
    timeOut: Boolean
  }

  type Error {
    name: String
    message: String
  }
 
  type Query {
    refresh(token: String): TimeOut
    searchUsers(username: String!): [SearchUser]
  }

  type Mutation {
    updateUsername(username: String!): CreateUsernameResponse
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): User
  }
`;
