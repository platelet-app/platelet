export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    possibleRiderResponsibilities {
      nextToken
      items {
          id
          _version
      }
    }
  }
}`;
