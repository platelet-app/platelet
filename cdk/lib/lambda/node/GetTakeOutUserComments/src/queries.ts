export const getUser = `query GetUser($id: ID!, $nextToken: String) {
  getUser(id: $id) {
    id
    comments(nextToken: $nextToken) {
      nextToken
      items {
          id
          _version
          _deleted
          body
      }
    }
  }
}`;
