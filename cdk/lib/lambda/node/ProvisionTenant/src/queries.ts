export const listTenants = `
  query ListTenants($limit: Int, $nextToken: String) {
    listTenants(limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        referenceIdentifier
        _version
        _deleted
        admin {
          id
          username
          contact {
            emailAddress
          }
        }
      }
      nextToken
    }
  }
`;

export const getTenant = `
  query GetTenant($id: ID!) {
    getTenant(id: $id) {
      id
      _version
      _deleted
    }
  }
`;

export const getUser = `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      _version
      _deleted
    }
  }
`;

export const createTenant = `
  mutation CreateTenant($input: CreateTenantInput!) {
    createTenant(input: $input) {
      id
      name
      referenceIdentifier
      _version
    }
  }
`;

export const deleteTenant = `
  mutation DeleteTenant($input: DeleteTenantInput!) {
    deleteTenant(input: $input) {
      id
    }
  }
`;

export const createUser = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      _version
      contact {
        emailAddress
      }
    }
  }
`;

export const updateUser = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      tenantId
      cognitoId
      _version
    }
  }
`;

export const deleteUser = `
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
    }
  }
`;
