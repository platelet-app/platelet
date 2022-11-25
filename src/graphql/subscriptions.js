/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTenant = /* GraphQL */ `
  subscription OnCreateTenant($filter: ModelSubscriptionTenantFilterInput) {
    onCreateTenant(filter: $filter) {
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
export const onUpdateTenant = /* GraphQL */ `
  subscription OnUpdateTenant($filter: ModelSubscriptionTenantFilterInput) {
    onUpdateTenant(filter: $filter) {
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
export const onDeleteTenant = /* GraphQL */ `
  subscription OnDeleteTenant($filter: ModelSubscriptionTenantFilterInput) {
    onDeleteTenant(filter: $filter) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreatePossibleRiderResponsibilities = /* GraphQL */ `
  subscription OnCreatePossibleRiderResponsibilities(
    $filter: ModelSubscriptionPossibleRiderResponsibilitiesFilterInput
  ) {
    onCreatePossibleRiderResponsibilities(filter: $filter) {
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
export const onUpdatePossibleRiderResponsibilities = /* GraphQL */ `
  subscription OnUpdatePossibleRiderResponsibilities(
    $filter: ModelSubscriptionPossibleRiderResponsibilitiesFilterInput
  ) {
    onUpdatePossibleRiderResponsibilities(filter: $filter) {
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
export const onDeletePossibleRiderResponsibilities = /* GraphQL */ `
  subscription OnDeletePossibleRiderResponsibilities(
    $filter: ModelSubscriptionPossibleRiderResponsibilitiesFilterInput
  ) {
    onDeletePossibleRiderResponsibilities(filter: $filter) {
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
export const onCreateVehicle = /* GraphQL */ `
  subscription OnCreateVehicle($filter: ModelSubscriptionVehicleFilterInput) {
    onCreateVehicle(filter: $filter) {
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
export const onUpdateVehicle = /* GraphQL */ `
  subscription OnUpdateVehicle($filter: ModelSubscriptionVehicleFilterInput) {
    onUpdateVehicle(filter: $filter) {
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
export const onDeleteVehicle = /* GraphQL */ `
  subscription OnDeleteVehicle($filter: ModelSubscriptionVehicleFilterInput) {
    onDeleteVehicle(filter: $filter) {
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
export const onCreateVehicleAssignment = /* GraphQL */ `
  subscription OnCreateVehicleAssignment(
    $filter: ModelSubscriptionVehicleAssignmentFilterInput
  ) {
    onCreateVehicleAssignment(filter: $filter) {
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
export const onUpdateVehicleAssignment = /* GraphQL */ `
  subscription OnUpdateVehicleAssignment(
    $filter: ModelSubscriptionVehicleAssignmentFilterInput
  ) {
    onUpdateVehicleAssignment(filter: $filter) {
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
export const onDeleteVehicleAssignment = /* GraphQL */ `
  subscription OnDeleteVehicleAssignment(
    $filter: ModelSubscriptionVehicleAssignmentFilterInput
  ) {
    onDeleteVehicleAssignment(filter: $filter) {
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
export const onCreateLocation = /* GraphQL */ `
  subscription OnCreateLocation($filter: ModelSubscriptionLocationFilterInput) {
    onCreateLocation(filter: $filter) {
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
export const onUpdateLocation = /* GraphQL */ `
  subscription OnUpdateLocation($filter: ModelSubscriptionLocationFilterInput) {
    onUpdateLocation(filter: $filter) {
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
export const onDeleteLocation = /* GraphQL */ `
  subscription OnDeleteLocation($filter: ModelSubscriptionLocationFilterInput) {
    onDeleteLocation(filter: $filter) {
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
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask($filter: ModelSubscriptionTaskFilterInput) {
    onCreateTask(filter: $filter) {
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask($filter: ModelSubscriptionTaskFilterInput) {
    onUpdateTask(filter: $filter) {
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask($filter: ModelSubscriptionTaskFilterInput) {
    onDeleteTask(filter: $filter) {
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
export const onCreateTaskAssignee = /* GraphQL */ `
  subscription OnCreateTaskAssignee(
    $filter: ModelSubscriptionTaskAssigneeFilterInput
  ) {
    onCreateTaskAssignee(filter: $filter) {
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
export const onUpdateTaskAssignee = /* GraphQL */ `
  subscription OnUpdateTaskAssignee(
    $filter: ModelSubscriptionTaskAssigneeFilterInput
  ) {
    onUpdateTaskAssignee(filter: $filter) {
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
export const onDeleteTaskAssignee = /* GraphQL */ `
  subscription OnDeleteTaskAssignee(
    $filter: ModelSubscriptionTaskAssigneeFilterInput
  ) {
    onDeleteTaskAssignee(filter: $filter) {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onCreateComment(filter: $filter, owner: $owner) {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onUpdateComment(filter: $filter, owner: $owner) {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onDeleteComment(filter: $filter, owner: $owner) {
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
export const onCreateDeliverableType = /* GraphQL */ `
  subscription OnCreateDeliverableType(
    $filter: ModelSubscriptionDeliverableTypeFilterInput
  ) {
    onCreateDeliverableType(filter: $filter) {
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
export const onUpdateDeliverableType = /* GraphQL */ `
  subscription OnUpdateDeliverableType(
    $filter: ModelSubscriptionDeliverableTypeFilterInput
  ) {
    onUpdateDeliverableType(filter: $filter) {
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
export const onDeleteDeliverableType = /* GraphQL */ `
  subscription OnDeleteDeliverableType(
    $filter: ModelSubscriptionDeliverableTypeFilterInput
  ) {
    onDeleteDeliverableType(filter: $filter) {
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
export const onCreateDeliverable = /* GraphQL */ `
  subscription OnCreateDeliverable(
    $filter: ModelSubscriptionDeliverableFilterInput
  ) {
    onCreateDeliverable(filter: $filter) {
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
export const onUpdateDeliverable = /* GraphQL */ `
  subscription OnUpdateDeliverable(
    $filter: ModelSubscriptionDeliverableFilterInput
  ) {
    onUpdateDeliverable(filter: $filter) {
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
export const onDeleteDeliverable = /* GraphQL */ `
  subscription OnDeleteDeliverable(
    $filter: ModelSubscriptionDeliverableFilterInput
  ) {
    onDeleteDeliverable(filter: $filter) {
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
export const onCreateRiderResponsibility = /* GraphQL */ `
  subscription OnCreateRiderResponsibility(
    $filter: ModelSubscriptionRiderResponsibilityFilterInput
  ) {
    onCreateRiderResponsibility(filter: $filter) {
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
export const onUpdateRiderResponsibility = /* GraphQL */ `
  subscription OnUpdateRiderResponsibility(
    $filter: ModelSubscriptionRiderResponsibilityFilterInput
  ) {
    onUpdateRiderResponsibility(filter: $filter) {
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
export const onDeleteRiderResponsibility = /* GraphQL */ `
  subscription OnDeleteRiderResponsibility(
    $filter: ModelSubscriptionRiderResponsibilityFilterInput
  ) {
    onDeleteRiderResponsibility(filter: $filter) {
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
