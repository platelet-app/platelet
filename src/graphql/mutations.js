/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const registerUser = /* GraphQL */ `
  mutation RegisterUser(
    $name: String
    $email: String
    $tenantId: ID
    $roles: [Role]
  ) {
    registerUser(name: $name, email: $email, tenantId: $tenantId, roles: $roles)
  }
`;
export const createTenant = /* GraphQL */ `
  mutation CreateTenant(
    $input: CreateTenantInput!
    $condition: ModelTenantConditionInput
  ) {
    createTenant(input: $input, condition: $condition) {
      id
      referenceIdentifier
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      referenceIdentifier
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      referenceIdentifier
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      vehicles {
        items {
          id
          tenantId
          assignedUserID
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
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
      active
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userRiderResponsibilityId
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
      vehicles {
        items {
          id
          tenantId
          assignedUserID
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
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
      active
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userRiderResponsibilityId
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
      vehicles {
        items {
          id
          tenantId
          assignedUserID
          name
          manufacturer
          model
          dateOfManufacture
          dateOfRegistration
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
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
      active
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userRiderResponsibilityId
    }
  }
`;
export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
      id
      taskGroupId
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
      id
      taskGroupId
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
      id
      taskGroupId
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      assignedUserID
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignedUser {
        id
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
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
export const updateVehicle = /* GraphQL */ `
  mutation UpdateVehicle(
    $input: UpdateVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    updateVehicle(input: $input, condition: $condition) {
      id
      tenantId
      assignedUserID
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignedUser {
        id
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
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
export const deleteVehicle = /* GraphQL */ `
  mutation DeleteVehicle(
    $input: DeleteVehicleInput!
    $condition: ModelVehicleConditionInput
  ) {
    deleteVehicle(input: $input, condition: $condition) {
      id
      tenantId
      assignedUserID
      name
      manufacturer
      model
      dateOfManufacture
      dateOfRegistration
      assignedUser {
        id
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
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
export const createLocation = /* GraphQL */ `
  mutation CreateLocation(
    $input: CreateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    createLocation(input: $input, condition: $condition) {
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
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        nextToken
        startedAt
      }
      tasksAsDropOff {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
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
export const updateLocation = /* GraphQL */ `
  mutation UpdateLocation(
    $input: UpdateLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    updateLocation(input: $input, condition: $condition) {
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
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        nextToken
        startedAt
      }
      tasksAsDropOff {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
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
export const deleteLocation = /* GraphQL */ `
  mutation DeleteLocation(
    $input: DeleteLocationInput!
    $condition: ModelLocationConditionInput
  ) {
    deleteLocation(input: $input, condition: $condition) {
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
          timeOfCall
          timePickedUp
          timeDroppedOff
          timeCancelled
          timeRejected
          timeRiderHome
          pickUpLocationId
          dropOffLocationId
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        nextToken
        startedAt
      }
      tasksAsDropOff {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
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
        comments {
          nextToken
          startedAt
        }
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
        comments {
          nextToken
          startedAt
        }
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
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
          taskDeliverablesId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          deliverableDeliverableTypeId
        }
        nextToken
        startedAt
      }
      relayPrevious {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      relayNext {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      group {
        items {
          id
          taskGroupId
          name
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
      taskCreatedById
      taskRiderResponsibilityId
      taskRelayPreviousId
      taskRelayNextId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
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
        comments {
          nextToken
          startedAt
        }
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
        comments {
          nextToken
          startedAt
        }
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
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
          taskDeliverablesId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          deliverableDeliverableTypeId
        }
        nextToken
        startedAt
      }
      relayPrevious {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      relayNext {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      group {
        items {
          id
          taskGroupId
          name
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
      taskCreatedById
      taskRiderResponsibilityId
      taskRelayPreviousId
      taskRelayNextId
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
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
        comments {
          nextToken
          startedAt
        }
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
        comments {
          nextToken
          startedAt
        }
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
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
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
          taskDeliverablesId
          count
          unit
          orderInGrid
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          deliverableDeliverableTypeId
        }
        nextToken
        startedAt
      }
      relayPrevious {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      relayNext {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      group {
        items {
          id
          taskGroupId
          name
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
      taskCreatedById
      taskRiderResponsibilityId
      taskRelayPreviousId
      taskRelayNextId
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
      taskId
      assigneeId
      role
      task {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      assignee {
        id
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      taskId
      assigneeId
      role
      task {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      assignee {
        id
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      taskId
      assigneeId
      role
      task {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
      }
      assignee {
        id
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      visibility
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      visibility
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
        vehicles {
          nextToken
          startedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
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
          nextToken
          startedAt
        }
        assignments {
          nextToken
          startedAt
        }
        active
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userRiderResponsibilityId
      }
      visibility
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
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
      tags
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
      tags
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
      tags
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
        tags
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      taskDeliverablesId
      task {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
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
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      deliverableDeliverableTypeId
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
        tags
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      taskDeliverablesId
      task {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
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
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      deliverableDeliverableTypeId
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
        tags
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      taskDeliverablesId
      task {
        id
        tenantId
        createdBy {
          id
          cognitoId
          tenantId
          displayName
          name
          roles
          dateOfBirth
          profilePictureURL
          profilePictureThumbnailURL
          active
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          userRiderResponsibilityId
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
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        assignees {
          nextToken
          startedAt
        }
        priority
        deliverables {
          nextToken
          startedAt
        }
        relayPrevious {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        relayNext {
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
          priority
          status
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          taskCreatedById
          taskRiderResponsibilityId
          taskRelayPreviousId
          taskRelayNextId
        }
        group {
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
        taskCreatedById
        taskRiderResponsibilityId
        taskRelayPreviousId
        taskRelayNextId
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
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      deliverableDeliverableTypeId
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
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
