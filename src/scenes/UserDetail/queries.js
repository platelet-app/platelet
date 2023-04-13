export const getUserQuery = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            username
            contact {
                emailAddress
                telephoneNumber
                mobileNumber
            }
            displayName
            name
            roles
            dateOfBirth
            patch
            profilePictureThumbnailURL
            active
        }
    }
`;

export const updateUser = /* GraphQL */ `
    mutation UpdateUser(
        $input: UpdateUserInput!
        $condition: ModelUserConditionInput
    ) {
        updateUser(input: $input, condition: $condition) {
            id
            username
            contact {
                name
                telephoneNumber
                mobileNumber
                emailAddress
                line1
                line2
                line3
                town
                county
                state
                country
                postcode
                what3words
            }
            displayName
            name
            roles
            dateOfBirth
            patch
            active
        }
    }
`;
