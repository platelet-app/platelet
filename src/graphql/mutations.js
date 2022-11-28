/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTenant = /* GraphQL */ `
  mutation CreateTenant(
    $input: CreateTenantInput!
    $condition: ModelTenantConditionInput
  ) {
    createTenant(input: $input, condition: $condition) {
      id
      name
      referenceIdentifier
      admin {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
    }
  }
`;
export const updateTenant = /* GraphQL */ `
  mutation UpdateTenant(
    $input: UpdateTenantInput!
    $condition: ModelTenantConditionInput
  ) {
    updateTenant(input: $input, condition: $condition) {
      id
      name
      referenceIdentifier
      admin {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
    }
  }
`;
export const deleteTenant = /* GraphQL */ `
  mutation DeleteTenant(
    $input: DeleteTenantInput!
    $condition: ModelTenantConditionInput
  ) {
    deleteTenant(input: $input, condition: $condition) {
      id
      name
      referenceIdentifier
      admin {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
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
      profilePicture {
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
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userAssignmentsId
          taskAssigneesId
        }
        nextToken
        startedAt
      }
      vehicleAssignments {
        items {
          id
          tenantId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userVehicleAssignmentsId
          vehicleAssignmentsId
        }
        nextToken
        startedAt
      }
      createdTasks {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      createdLocations {
        items {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        nextToken
        startedAt
      }
      createdVehicles {
        items {
          id
          tenantId
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedVehiclesId
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
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
      profilePicture {
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
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userAssignmentsId
          taskAssigneesId
        }
        nextToken
        startedAt
      }
      vehicleAssignments {
        items {
          id
          tenantId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userVehicleAssignmentsId
          vehicleAssignmentsId
        }
        nextToken
        startedAt
      }
      createdTasks {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      createdLocations {
        items {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        nextToken
        startedAt
      }
      createdVehicles {
        items {
          id
          tenantId
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedVehiclesId
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
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
      profilePicture {
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
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userAssignmentsId
          taskAssigneesId
        }
        nextToken
        startedAt
      }
      vehicleAssignments {
        items {
          id
          tenantId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userVehicleAssignmentsId
          vehicleAssignmentsId
        }
        nextToken
        startedAt
      }
      createdTasks {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      createdLocations {
        items {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        nextToken
        startedAt
      }
      createdVehicles {
        items {
          id
          tenantId
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedVehiclesId
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
export const createPossibleRiderResponsibilities = /* GraphQL */ `
  mutation CreatePossibleRiderResponsibilities(
    $input: CreatePossibleRiderResponsibilitiesInput!
    $condition: ModelPossibleRiderResponsibilitiesConditionInput
  ) {
    createPossibleRiderResponsibilities(input: $input, condition: $condition) {
      id
      tenantId
      user {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      riderResponsibility {
        id
        tenantId
        label
        disabled
        possibleUsers {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userPossibleRiderResponsibilitiesId
      riderResponsibilityPossibleUsersId
    }
  }
`;
export const updatePossibleRiderResponsibilities = /* GraphQL */ `
  mutation UpdatePossibleRiderResponsibilities(
    $input: UpdatePossibleRiderResponsibilitiesInput!
    $condition: ModelPossibleRiderResponsibilitiesConditionInput
  ) {
    updatePossibleRiderResponsibilities(input: $input, condition: $condition) {
      id
      tenantId
      user {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      riderResponsibility {
        id
        tenantId
        label
        disabled
        possibleUsers {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userPossibleRiderResponsibilitiesId
      riderResponsibilityPossibleUsersId
    }
  }
`;
export const deletePossibleRiderResponsibilities = /* GraphQL */ `
  mutation DeletePossibleRiderResponsibilities(
    $input: DeletePossibleRiderResponsibilitiesInput!
    $condition: ModelPossibleRiderResponsibilitiesConditionInput
  ) {
    deletePossibleRiderResponsibilities(input: $input, condition: $condition) {
      id
      tenantId
      user {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      riderResponsibility {
        id
        tenantId
        label
        disabled
        possibleUsers {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userPossibleRiderResponsibilitiesId
      riderResponsibilityPossibleUsersId
    }
  }
`;
export const createVehicle = /* GraphQL */ `
  mutation CreateVehicle(
    $input: CreateVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    createVehicle(input: $input, condition: $condition) {
      id
      tenantId
      createdBy {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignments {
        items {
          id
          tenantId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userVehicleAssignmentsId
          vehicleAssignmentsId
        }
        nextToken
        startedAt
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
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
    }
  }
`;
export const updateVehicle = /* GraphQL */ `
  mutation UpdateVehicle(
    $input: UpdateVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    updateVehicle(input: $input, condition: $condition) {
      id
      tenantId
      createdBy {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignments {
        items {
          id
          tenantId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userVehicleAssignmentsId
          vehicleAssignmentsId
        }
        nextToken
        startedAt
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
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
    }
  }
`;
export const deleteVehicle = /* GraphQL */ `
  mutation DeleteVehicle(
    $input: DeleteVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    deleteVehicle(input: $input, condition: $condition) {
      id
      tenantId
      createdBy {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignments {
        items {
          id
          tenantId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userVehicleAssignmentsId
          vehicleAssignmentsId
        }
        nextToken
        startedAt
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
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedVehiclesId
    }
  }
`;
export const createVehicleAssignment = /* GraphQL */ `
  mutation CreateVehicleAssignment(
    $input: CreateVehicleAssignmentInput!
    $condition: ModelVehicleAssignmentConditionInput
  ) {
    createVehicleAssignment(input: $input, condition: $condition) {
      id
      tenantId
      vehicle {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        manufacturer
        model
        dateOfManufacture
        dateOfRegistration
        assignments {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedVehiclesId
      }
      assignee {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userVehicleAssignmentsId
      vehicleAssignmentsId
    }
  }
`;
export const updateVehicleAssignment = /* GraphQL */ `
  mutation UpdateVehicleAssignment(
    $input: UpdateVehicleAssignmentInput!
    $condition: ModelVehicleAssignmentConditionInput
  ) {
    updateVehicleAssignment(input: $input, condition: $condition) {
      id
      tenantId
      vehicle {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        manufacturer
        model
        dateOfManufacture
        dateOfRegistration
        assignments {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedVehiclesId
      }
      assignee {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userVehicleAssignmentsId
      vehicleAssignmentsId
    }
  }
`;
export const deleteVehicleAssignment = /* GraphQL */ `
  mutation DeleteVehicleAssignment(
    $input: DeleteVehicleAssignmentInput!
    $condition: ModelVehicleAssignmentConditionInput
  ) {
    deleteVehicleAssignment(input: $input, condition: $condition) {
      id
      tenantId
      vehicle {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        manufacturer
        model
        dateOfManufacture
        dateOfRegistration
        assignments {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedVehiclesId
      }
      assignee {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userVehicleAssignmentsId
      vehicleAssignmentsId
    }
  }
`;
export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
      id
      tenantId
      createdBy {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      name
      listed
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
      tasksAsPickUp {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      tasksAsDropOff {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      taskAsEstablishment {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      disabled
      googleMapsPlaceId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
    }
  }
`;
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
      id
      tenantId
      createdBy {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      name
      listed
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
      tasksAsPickUp {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      tasksAsDropOff {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      taskAsEstablishment {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      disabled
      googleMapsPlaceId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
    }
  }
`;
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
      id
      tenantId
      createdBy {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      name
      listed
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
      tasksAsPickUp {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      tasksAsDropOff {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      taskAsEstablishment {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      disabled
      googleMapsPlaceId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedLocationsId
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
      id
      tenantId
      createdBy {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      dateCreated
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      requesterContact {
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
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      pickUpLocation {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        listed
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
        tasksAsPickUp {
          nextToken
          startedAt
        }
        tasksAsDropOff {
          nextToken
          startedAt
        }
        taskAsEstablishment {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        googleMapsPlaceId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedLocationsId
      }
      dropOffLocation {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        listed
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
        tasksAsPickUp {
          nextToken
          startedAt
        }
        tasksAsDropOff {
          nextToken
          startedAt
        }
        taskAsEstablishment {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        googleMapsPlaceId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedLocationsId
      }
      establishmentLocation {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        listed
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
        tasksAsPickUp {
          nextToken
          startedAt
        }
        tasksAsDropOff {
          nextToken
          startedAt
        }
        taskAsEstablishment {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        googleMapsPlaceId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedLocationsId
      }
      riderResponsibility
      assignees {
        items {
          id
          tenantId
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userAssignmentsId
          taskAssigneesId
        }
        nextToken
        startedAt
      }
      priority
      deliverables {
        items {
          id
          tenantId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskDeliverablesId
          deliverableTypeDeliverablesId
        }
        nextToken
        startedAt
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
      status
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
    }
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
      id
      tenantId
      createdBy {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      dateCreated
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      requesterContact {
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
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      pickUpLocation {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        listed
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
        tasksAsPickUp {
          nextToken
          startedAt
        }
        tasksAsDropOff {
          nextToken
          startedAt
        }
        taskAsEstablishment {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        googleMapsPlaceId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedLocationsId
      }
      dropOffLocation {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        listed
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
        tasksAsPickUp {
          nextToken
          startedAt
        }
        tasksAsDropOff {
          nextToken
          startedAt
        }
        taskAsEstablishment {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        googleMapsPlaceId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedLocationsId
      }
      establishmentLocation {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        listed
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
        tasksAsPickUp {
          nextToken
          startedAt
        }
        tasksAsDropOff {
          nextToken
          startedAt
        }
        taskAsEstablishment {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        googleMapsPlaceId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedLocationsId
      }
      riderResponsibility
      assignees {
        items {
          id
          tenantId
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userAssignmentsId
          taskAssigneesId
        }
        nextToken
        startedAt
      }
      priority
      deliverables {
        items {
          id
          tenantId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskDeliverablesId
          deliverableTypeDeliverablesId
        }
        nextToken
        startedAt
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
      status
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
    }
  }
`;
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
      id
      tenantId
      createdBy {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      dateCreated
      timeOfCall
      timePickedUp
      timePickedUpSenderName
      timeDroppedOff
      timeDroppedOffRecipientName
      timeCancelled
      timeRejected
      timeRiderHome
      requesterContact {
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
      pickUpLocationId
      dropOffLocationId
      establishmentLocationId
      pickUpLocation {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        listed
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
        tasksAsPickUp {
          nextToken
          startedAt
        }
        tasksAsDropOff {
          nextToken
          startedAt
        }
        taskAsEstablishment {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        googleMapsPlaceId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedLocationsId
      }
      dropOffLocation {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        listed
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
        tasksAsPickUp {
          nextToken
          startedAt
        }
        tasksAsDropOff {
          nextToken
          startedAt
        }
        taskAsEstablishment {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        googleMapsPlaceId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedLocationsId
      }
      establishmentLocation {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        name
        listed
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
        tasksAsPickUp {
          nextToken
          startedAt
        }
        tasksAsDropOff {
          nextToken
          startedAt
        }
        taskAsEstablishment {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        disabled
        googleMapsPlaceId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedLocationsId
      }
      riderResponsibility
      assignees {
        items {
          id
          tenantId
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userAssignmentsId
          taskAssigneesId
        }
        nextToken
        startedAt
      }
      priority
      deliverables {
        items {
          id
          tenantId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskDeliverablesId
          deliverableTypeDeliverablesId
        }
        nextToken
        startedAt
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
      status
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCreatedTasksId
    }
  }
`;
export const createTaskAssignee = /* GraphQL */ `
  mutation CreateTaskAssignee(
    $input: CreateTaskAssigneeInput!
    $condition: ModelTaskAssigneeConditionInput
  ) {
    createTaskAssignee(input: $input, condition: $condition) {
      id
      tenantId
      role
      task {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        dateCreated
        timeOfCall
        timePickedUp
        timePickedUpSenderName
        timeDroppedOff
        timeDroppedOffRecipientName
        timeCancelled
        timeRejected
        timeRiderHome
        requesterContact {
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
        pickUpLocationId
        dropOffLocationId
        establishmentLocationId
        pickUpLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        dropOffLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        establishmentLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        riderResponsibility
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedTasksId
      }
      assignee {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userAssignmentsId
      taskAssigneesId
    }
  }
`;
export const updateTaskAssignee = /* GraphQL */ `
  mutation UpdateTaskAssignee(
    $input: UpdateTaskAssigneeInput!
    $condition: ModelTaskAssigneeConditionInput
  ) {
    updateTaskAssignee(input: $input, condition: $condition) {
      id
      tenantId
      role
      task {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        dateCreated
        timeOfCall
        timePickedUp
        timePickedUpSenderName
        timeDroppedOff
        timeDroppedOffRecipientName
        timeCancelled
        timeRejected
        timeRiderHome
        requesterContact {
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
        pickUpLocationId
        dropOffLocationId
        establishmentLocationId
        pickUpLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        dropOffLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        establishmentLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        riderResponsibility
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedTasksId
      }
      assignee {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userAssignmentsId
      taskAssigneesId
    }
  }
`;
export const deleteTaskAssignee = /* GraphQL */ `
  mutation DeleteTaskAssignee(
    $input: DeleteTaskAssigneeInput!
    $condition: ModelTaskAssigneeConditionInput
  ) {
    deleteTaskAssignee(input: $input, condition: $condition) {
      id
      tenantId
      role
      task {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        dateCreated
        timeOfCall
        timePickedUp
        timePickedUpSenderName
        timeDroppedOff
        timeDroppedOffRecipientName
        timeCancelled
        timeRejected
        timeRiderHome
        requesterContact {
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
        pickUpLocationId
        dropOffLocationId
        establishmentLocationId
        pickUpLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        dropOffLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        establishmentLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        riderResponsibility
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedTasksId
      }
      assignee {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userAssignmentsId
      taskAssigneesId
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      parentId
      tenantId
      body
      author {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      visibility
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      owner
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      parentId
      tenantId
      body
      author {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      visibility
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      owner
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      parentId
      tenantId
      body
      author {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      visibility
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userCommentsId
      owner
    }
  }
`;
export const createDeliverableType = /* GraphQL */ `
  mutation CreateDeliverableType(
    $input: CreateDeliverableTypeInput!
    $condition: ModelDeliverableTypeConditionInput
  ) {
    createDeliverableType(input: $input, condition: $condition) {
      id
      label
      tenantId
      icon
      defaultUnit
      deliverables {
        items {
          id
          tenantId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskDeliverablesId
          deliverableTypeDeliverablesId
        }
        nextToken
        startedAt
      }
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateDeliverableType = /* GraphQL */ `
  mutation UpdateDeliverableType(
    $input: UpdateDeliverableTypeInput!
    $condition: ModelDeliverableTypeConditionInput
  ) {
    updateDeliverableType(input: $input, condition: $condition) {
      id
      label
      tenantId
      icon
      defaultUnit
      deliverables {
        items {
          id
          tenantId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskDeliverablesId
          deliverableTypeDeliverablesId
        }
        nextToken
        startedAt
      }
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteDeliverableType = /* GraphQL */ `
  mutation DeleteDeliverableType(
    $input: DeleteDeliverableTypeInput!
    $condition: ModelDeliverableTypeConditionInput
  ) {
    deleteDeliverableType(input: $input, condition: $condition) {
      id
      label
      tenantId
      icon
      defaultUnit
      deliverables {
        items {
          id
          tenantId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskDeliverablesId
          deliverableTypeDeliverablesId
        }
        nextToken
        startedAt
      }
      tags
      disabled
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createDeliverable = /* GraphQL */ `
  mutation CreateDeliverable(
    $input: CreateDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    createDeliverable(input: $input, condition: $condition) {
      id
      tenantId
      deliverableType {
        id
        label
        tenantId
        icon
        defaultUnit
        deliverables {
          nextToken
          startedAt
        }
        tags
        disabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      task {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        dateCreated
        timeOfCall
        timePickedUp
        timePickedUpSenderName
        timeDroppedOff
        timeDroppedOffRecipientName
        timeCancelled
        timeRejected
        timeRiderHome
        requesterContact {
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
        pickUpLocationId
        dropOffLocationId
        establishmentLocationId
        pickUpLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        dropOffLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        establishmentLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        riderResponsibility
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedTasksId
      }
      count
      unit
      orderInGrid
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      taskDeliverablesId
      deliverableTypeDeliverablesId
    }
  }
`;
export const updateDeliverable = /* GraphQL */ `
  mutation UpdateDeliverable(
    $input: UpdateDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    updateDeliverable(input: $input, condition: $condition) {
      id
      tenantId
      deliverableType {
        id
        label
        tenantId
        icon
        defaultUnit
        deliverables {
          nextToken
          startedAt
        }
        tags
        disabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      task {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        dateCreated
        timeOfCall
        timePickedUp
        timePickedUpSenderName
        timeDroppedOff
        timeDroppedOffRecipientName
        timeCancelled
        timeRejected
        timeRiderHome
        requesterContact {
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
        pickUpLocationId
        dropOffLocationId
        establishmentLocationId
        pickUpLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        dropOffLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        establishmentLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        riderResponsibility
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedTasksId
      }
      count
      unit
      orderInGrid
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      taskDeliverablesId
      deliverableTypeDeliverablesId
    }
  }
`;
export const deleteDeliverable = /* GraphQL */ `
  mutation DeleteDeliverable(
    $input: DeleteDeliverableInput!
    $condition: ModelDeliverableConditionInput
  ) {
    deleteDeliverable(input: $input, condition: $condition) {
      id
      tenantId
      deliverableType {
        id
        label
        tenantId
        icon
        defaultUnit
        deliverables {
          nextToken
          startedAt
        }
        tags
        disabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      task {
        id
        tenantId
        createdBy {
          id
          username
          cognitoId
          tenantId
          isPrimaryAdmin
          displayName
          name
          roles
          dateOfBirth
          riderResponsibility
          profilePictureURL
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        dateCreated
        timeOfCall
        timePickedUp
        timePickedUpSenderName
        timeDroppedOff
        timeDroppedOffRecipientName
        timeCancelled
        timeRejected
        timeRiderHome
        requesterContact {
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
        pickUpLocationId
        dropOffLocationId
        establishmentLocationId
        pickUpLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        dropOffLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        establishmentLocation {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        riderResponsibility
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        comments {
          nextToken
          startedAt
        }
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userCreatedTasksId
      }
      count
      unit
      orderInGrid
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      taskDeliverablesId
      deliverableTypeDeliverablesId
    }
  }
`;
export const createRiderResponsibility = /* GraphQL */ `
  mutation CreateRiderResponsibility(
    $input: CreateRiderResponsibilityInput!
    $condition: ModelRiderResponsibilityConditionInput
  ) {
    createRiderResponsibility(input: $input, condition: $condition) {
      id
      tenantId
      label
      disabled
      possibleUsers {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateRiderResponsibility = /* GraphQL */ `
  mutation UpdateRiderResponsibility(
    $input: UpdateRiderResponsibilityInput!
    $condition: ModelRiderResponsibilityConditionInput
  ) {
    updateRiderResponsibility(input: $input, condition: $condition) {
      id
      tenantId
      label
      disabled
      possibleUsers {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteRiderResponsibility = /* GraphQL */ `
  mutation DeleteRiderResponsibility(
    $input: DeleteRiderResponsibilityInput!
    $condition: ModelRiderResponsibilityConditionInput
  ) {
    deleteRiderResponsibility(input: $input, condition: $condition) {
      id
      tenantId
      label
      disabled
      possibleUsers {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const registerUser = /* GraphQL */ `
  mutation RegisterUser(
    $name: String
    $email: String
    $tenantId: ID
    $roles: [Role]
  ) {
    registerUser(
      name: $name
      email: $email
      tenantId: $tenantId
      roles: $roles
    ) {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
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
      profilePicture {
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
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userAssignmentsId
          taskAssigneesId
        }
        nextToken
        startedAt
      }
      vehicleAssignments {
        items {
          id
          tenantId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userVehicleAssignmentsId
          vehicleAssignmentsId
        }
        nextToken
        startedAt
      }
      createdTasks {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      createdLocations {
        items {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        nextToken
        startedAt
      }
      createdVehicles {
        items {
          id
          tenantId
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedVehiclesId
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
export const registerTenant = /* GraphQL */ `
  mutation RegisterTenant(
    $name: String
    $emailAddress: String
    $tenantName: String
  ) {
    registerTenant(
      name: $name
      emailAddress: $emailAddress
      tenantName: $tenantName
    ) {
      id
      name
      referenceIdentifier
      admin {
        id
        username
        cognitoId
        tenantId
        isPrimaryAdmin
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
          nextToken
          startedAt
        }
        profilePictureURL
        profilePicture {
          bucket
          key
          region
        }
        comments {
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        vehicleAssignments {
          nextToken
          startedAt
        }
        createdTasks {
          nextToken
          startedAt
        }
        createdLocations {
          nextToken
          startedAt
        }
        createdVehicles {
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      tenantAdminId
    }
  }
`;
export const updateUserRoles = /* GraphQL */ `
  mutation UpdateUserRoles($userId: ID, $roles: [Role]) {
    updateUserRoles(userId: $userId, roles: $roles) {
      id
      username
      cognitoId
      tenantId
      isPrimaryAdmin
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
      profilePicture {
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
          role
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userAssignmentsId
          taskAssigneesId
        }
        nextToken
        startedAt
      }
      vehicleAssignments {
        items {
          id
          tenantId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userVehicleAssignmentsId
          vehicleAssignmentsId
        }
        nextToken
        startedAt
      }
      createdTasks {
        items {
          id
          tenantId
          dateCreated
          timeOfCall
          timePickedUp
          timePickedUpSenderName
          timeDroppedOff
          timeDroppedOffRecipientName
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          establishmentLocationId
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
      createdLocations {
        items {
          id
          tenantId
          name
          listed
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
          disabled
          googleMapsPlaceId
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedLocationsId
        }
        nextToken
        startedAt
      }
      createdVehicles {
        items {
          id
          tenantId
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          disabled
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userCreatedVehiclesId
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
