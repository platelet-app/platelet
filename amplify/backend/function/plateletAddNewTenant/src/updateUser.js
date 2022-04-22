const gql = require("graphql-tag");

exports.updateUser = gql`
    mutation UpdateUser(
        $input: UpdateUserInput!
        $condition: ModelUserConditionInput
    ) {
        updateUser(input: $input, condition: $condition) {
            id
            username
            cognitoId
            tenantId
            contact {
                name
                telephoneNumber
                mobileNumber
                emailAddress
                ward
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
            riderResponsibility
            possibleRiderResponsibilities {
                items {
                    id
                    tenantId
                    createdAt
                    updatedAt
                    _version
                    _deleted
                    _lastChangedAt
                    userPossibleRiderResponsibilitiesId
                    riderResponsibilityPossibleUsersId
                }
                nextToken
                startedAt
            }
            profilePictureURL
            profilePictureThumbnailURL
            profilePicture {
                bucket
                key
                region
            }
            profilePictureThumbnail {
                bucket
                key
                region
            }
            comments {
                items {
                    id
                    parentId
                    tenantId
                    body
                    visibility
                    createdAt
                    updatedAt
                    _version
                    _deleted
                    _lastChangedAt
                    userCommentsId
                    owner
                }
                nextToken
                startedAt
            }
            assignments {
                items {
                    id
                    tenantId
                    taskId
                    assigneeId
                    role
                    createdAt
                    updatedAt
                    _version
                    _deleted
                    _lastChangedAt
                }
                nextToken
                startedAt
            }
            createdTasks {
                items {
                    id
                    tenantId
                    timeOfCall
                    timePickedUp
                    timeDroppedOff
                    timeCancelled
                    timeRejected
                    timeRiderHome
                    pickUpLocationId
                    dropOffLocationId
                    riderResponsibility
                    priority
                    status
                    createdAt
                    updatedAt
                    _version
                    _deleted
                    _lastChangedAt
                    userCreatedTasksId
                }
                nextToken
                startedAt
            }
            disabled
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
        }
    }
`;
