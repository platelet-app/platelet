export const getUser = `query GetUser($id: ID!, $nextToken: String) {
  getUser(id: $id) {
    id
    assignments(nextToken: $nextToken) {
      nextToken
      items {
          id
          _version
          _deleted
      }
    }
  }
}`;
