export const getUser = `query GetUser($id: ID!, $nextToken: String) {
  getUser(id: $id) {
    id
    possibleRiderResponsibilities(nextToken: $nextToken) {
      nextToken
      items {
          id
          _version
      }
    }
  }
}`;
