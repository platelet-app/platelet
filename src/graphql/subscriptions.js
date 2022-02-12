/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      active
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      active
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      active
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup {
    onCreateGroup {
      id
      taskGroupId
      name
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup {
    onUpdateGroup {
      id
      taskGroupId
      name
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup {
    onDeleteGroup {
      id
      taskGroupId
      name
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateVehicle = /* GraphQL */ `
  subscription OnCreateVehicle {
    onCreateVehicle {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          parentId
          tenantId
          body
          visibility
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateVehicle = /* GraphQL */ `
  subscription OnUpdateVehicle {
    onUpdateVehicle {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          parentId
          tenantId
          body
          visibility
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteVehicle = /* GraphQL */ `
  subscription OnDeleteVehicle {
    onDeleteVehicle {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          parentId
          tenantId
          body
          visibility
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        tags
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        tags
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
        tags
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask {
    onCreateTask {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      assignees {
        items {
          id
          tenantId
          taskId
          assigneeId
          role
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      group {
        items {
          id
          taskGroupId
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      status
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask {
    onUpdateTask {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      assignees {
        items {
          id
          tenantId
          taskId
          assigneeId
          role
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      group {
        items {
          id
          taskGroupId
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      status
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask {
    onDeleteTask {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      riderResponsibility {
        id
        tenantId
        label
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      assignees {
        items {
          id
          tenantId
          taskId
          assigneeId
          role
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      group {
        items {
          id
          taskGroupId
          name
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      status
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        riderResponsibility {
          id
          tenantId
          label
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      visibility
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      visibility
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
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
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      visibility
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
      tags
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
      tags
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
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
      tags
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRiderResponsibility = /* GraphQL */ `
  subscription OnCreateRiderResponsibility {
    onCreateRiderResponsibility {
      id
      tenantId
      label
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRiderResponsibility = /* GraphQL */ `
  subscription OnUpdateRiderResponsibility {
    onUpdateRiderResponsibility {
      id
      tenantId
      label
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRiderResponsibility = /* GraphQL */ `
  subscription OnDeleteRiderResponsibility {
    onDeleteRiderResponsibility {
      id
      tenantId
      label
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
