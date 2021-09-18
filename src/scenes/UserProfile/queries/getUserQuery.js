export const getUserQuery = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            username
            contact {
                emailAddress
            }
            displayName
            name
            roles
            dateOfBirth
            patch
            profilePictureURL
            profilePictureThumbnailURL
            active
        }
    }
`;
