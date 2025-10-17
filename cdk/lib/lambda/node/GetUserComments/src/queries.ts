export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    comments {
      nextToken
      items {
          id
          _version
          _deleted
      }
    }
  }
}`;
