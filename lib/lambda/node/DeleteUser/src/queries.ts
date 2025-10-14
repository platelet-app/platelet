export const getUser = `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      disabled
      username
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
