export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    assignments {
      nextToken
      items {
          id
          _version
      }
    }
  }
}`;
