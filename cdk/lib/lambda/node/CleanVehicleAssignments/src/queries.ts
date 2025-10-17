export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    vehicleAssignments {
      nextToken
      items {
          id
          _version
          _deleted
      }
    }
  }
}`;
