export const getUser = `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      disabled
      username
      createdAt
      updatedAt
      profilePicture {
          key
          bucket
      }
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
