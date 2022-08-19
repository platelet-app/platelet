/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTenant = /* GraphQL */ `
  subscription OnCreateTenant {
    onCreateTenant {
      id
      name
      referenceIdentifier
      admin {
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
  subscription OnUpdateTenant {
    onUpdateTenant {
      id
      name
      referenceIdentifier
      admin {
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
  subscription OnDeleteTenant {
    onDeleteTenant {
      id
      name
      referenceIdentifier
      admin {
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
  subscription OnCreateUser {
    onCreateUser {
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
          timeDroppedOff
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
  subscription OnUpdateUser {
    onUpdateUser {
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
          timeDroppedOff
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
  subscription OnDeleteUser {
    onDeleteUser {
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
          timeDroppedOff
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
  subscription OnCreatePossibleRiderResponsibilities {
    onCreatePossibleRiderResponsibilities {
      id
      tenantId
      user {
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
  subscription OnUpdatePossibleRiderResponsibilities {
    onUpdatePossibleRiderResponsibilities {
      id
      tenantId
      user {
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
  subscription OnDeletePossibleRiderResponsibilities {
    onDeletePossibleRiderResponsibilities {
      id
      tenantId
      user {
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
  subscription OnCreateVehicle {
    onCreateVehicle {
      id
      tenantId
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
    }
  }
`;
export const onUpdateVehicle = /* GraphQL */ `
  subscription OnUpdateVehicle {
    onUpdateVehicle {
      id
      tenantId
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
    }
  }
`;
export const onDeleteVehicle = /* GraphQL */ `
  subscription OnDeleteVehicle {
    onDeleteVehicle {
      id
      tenantId
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
    }
  }
`;
export const onCreateVehicleAssignment = /* GraphQL */ `
  subscription OnCreateVehicleAssignment {
    onCreateVehicleAssignment {
      id
      tenantId
      vehicle {
        id
        tenantId
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
      }
      assignee {
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
  subscription OnUpdateVehicleAssignment {
    onUpdateVehicleAssignment {
      id
      tenantId
      vehicle {
        id
        tenantId
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
      }
      assignee {
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
  subscription OnDeleteVehicleAssignment {
    onDeleteVehicleAssignment {
      id
      tenantId
      vehicle {
        id
        tenantId
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
      }
      assignee {
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
  subscription OnCreateLocation {
    onCreateLocation {
      id
      tenantId
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
          timeDroppedOff
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
          timeDroppedOff
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
          timeDroppedOff
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateLocation = /* GraphQL */ `
  subscription OnUpdateLocation {
    onUpdateLocation {
      id
      tenantId
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
          timeDroppedOff
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
          timeDroppedOff
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
          timeDroppedOff
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteLocation = /* GraphQL */ `
  subscription OnDeleteLocation {
    onDeleteLocation {
      id
      tenantId
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
          timeDroppedOff
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
          timeDroppedOff
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
          timeDroppedOff
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
      id
      tenantId
      dateCreated
      createdBy {
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
        disabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      timeOfCall
      timePickedUp
      timeDroppedOff
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      dropOffLocation {
        id
        tenantId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      establishmentLocation {
        id
        tenantId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      riderResponsibility
      assignees {
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
  subscription OnUpdateTask {
    onUpdateTask {
      id
      tenantId
      dateCreated
      createdBy {
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
        disabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      timeOfCall
      timePickedUp
      timeDroppedOff
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      dropOffLocation {
        id
        tenantId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      establishmentLocation {
        id
        tenantId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      riderResponsibility
      assignees {
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
  subscription OnDeleteTask {
    onDeleteTask {
      id
      tenantId
      dateCreated
      createdBy {
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
        disabled
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      timeOfCall
      timePickedUp
      timeDroppedOff
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      dropOffLocation {
        id
        tenantId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      establishmentLocation {
        id
        tenantId
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      riderResponsibility
      assignees {
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
  subscription OnCreateTaskAssignee {
    onCreateTaskAssignee {
      id
      tenantId
      taskId
      assigneeId
      role
      task {
        id
        tenantId
        dateCreated
        createdBy {
          id
          username
          cognitoId
          tenantId
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
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
    }
  }
`;
export const onUpdateTaskAssignee = /* GraphQL */ `
  subscription OnUpdateTaskAssignee {
    onUpdateTaskAssignee {
      id
      tenantId
      taskId
      assigneeId
      role
      task {
        id
        tenantId
        dateCreated
        createdBy {
          id
          username
          cognitoId
          tenantId
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
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
    }
  }
`;
export const onDeleteTaskAssignee = /* GraphQL */ `
  subscription OnDeleteTaskAssignee {
    onDeleteTaskAssignee {
      id
      tenantId
      taskId
      assigneeId
      role
      task {
        id
        tenantId
        dateCreated
        createdBy {
          id
          username
          cognitoId
          tenantId
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
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($owner: String) {
    onCreateComment(owner: $owner) {
      id
      parentId
      tenantId
      body
      author {
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
  subscription OnUpdateComment($owner: String) {
    onUpdateComment(owner: $owner) {
      id
      parentId
      tenantId
      body
      author {
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
  subscription OnDeleteComment($owner: String) {
    onDeleteComment(owner: $owner) {
      id
      parentId
      tenantId
      body
      author {
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
  subscription OnCreateDeliverableType {
    onCreateDeliverableType {
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
  subscription OnUpdateDeliverableType {
    onUpdateDeliverableType {
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
  subscription OnDeleteDeliverableType {
    onDeleteDeliverableType {
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
  subscription OnCreateDeliverable {
    onCreateDeliverable {
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
        dateCreated
        createdBy {
          id
          username
          cognitoId
          tenantId
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
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
  subscription OnUpdateDeliverable {
    onUpdateDeliverable {
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
        dateCreated
        createdBy {
          id
          username
          cognitoId
          tenantId
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
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
  subscription OnDeleteDeliverable {
    onDeleteDeliverable {
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
        dateCreated
        createdBy {
          id
          username
          cognitoId
          tenantId
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
        timeOfCall
        timePickedUp
        timeDroppedOff
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
  subscription OnCreateRiderResponsibility {
    onCreateRiderResponsibility {
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
  subscription OnUpdateRiderResponsibility {
    onUpdateRiderResponsibility {
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
  subscription OnDeleteRiderResponsibility {
    onDeleteRiderResponsibility {
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
