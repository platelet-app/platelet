export const schema = {
    "models": {
        "User": {
            "name": "User",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "username": {
                    "name": "username",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "cognitoId": {
                    "name": "cognitoId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "contact": {
                    "name": "contact",
                    "isArray": false,
                    "type": {
                        "nonModel": "AddressAndContactDetails"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "displayName": {
                    "name": "displayName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "roles": {
                    "name": "roles",
                    "isArray": true,
                    "type": {
                        "enum": "Role"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "isArrayNullable": false
                },
                "dateOfBirth": {
                    "name": "dateOfBirth",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "riderResponsibility": {
                    "name": "riderResponsibility",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "possibleRiderResponsibilities": {
                    "name": "possibleRiderResponsibilities",
                    "isArray": true,
                    "type": {
                        "model": "PossibleRiderResponsibilities"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userPossibleRiderResponsibilitiesId"
                    }
                },
                "profilePictureURL": {
                    "name": "profilePictureURL",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "profilePictureThumbnailURL": {
                    "name": "profilePictureThumbnailURL",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "profilePicture": {
                    "name": "profilePicture",
                    "isArray": false,
                    "type": {
                        "nonModel": "S3Object"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "profilePictureThumbnail": {
                    "name": "profilePictureThumbnail",
                    "isArray": false,
                    "type": {
                        "nonModel": "S3Object"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userCommentsId"
                    }
                },
                "assignments": {
                    "name": "assignments",
                    "isArray": true,
                    "type": {
                        "model": "TaskAssignee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "assignee"
                    }
                },
                "createdTasks": {
                    "name": "createdTasks",
                    "isArray": true,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "userCreatedTasksId"
                    }
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Users",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byCognitoId",
                        "queryField": "getUserByCognitoId",
                        "fields": [
                            "cognitoId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "cognitoId",
                                "allow": "owner",
                                "operations": [
                                    "update"
                                ],
                                "identityClaim": "cognito:username"
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "PossibleRiderResponsibilities": {
            "name": "PossibleRiderResponsibilities",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "user": {
                    "name": "user",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userPossibleRiderResponsibilitiesId"
                    }
                },
                "riderResponsibility": {
                    "name": "riderResponsibility",
                    "isArray": false,
                    "type": {
                        "model": "RiderResponsibility"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "riderResponsibilityPossibleUsersId"
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "PossibleRiderResponsibilities",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "COORDINATOR",
                                    "RIDER",
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "RiderResponsibility": {
            "name": "RiderResponsibility",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "label": {
                    "name": "label",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "possibleUsers": {
                    "name": "possibleUsers",
                    "isArray": true,
                    "type": {
                        "model": "PossibleRiderResponsibilities"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "riderResponsibilityPossibleUsersId"
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "RiderResponsibilities",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Comment": {
            "name": "Comment",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "parentId": {
                    "name": "parentId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "body": {
                    "name": "body",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "author": {
                    "name": "author",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userCommentsId"
                    }
                },
                "visibility": {
                    "name": "visibility",
                    "isArray": false,
                    "type": {
                        "enum": "CommentVisibility"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Comments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byParent",
                        "fields": [
                            "parentId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "provider": "userPools",
                                "ownerField": "owner",
                                "allow": "owner",
                                "operations": [
                                    "create",
                                    "read",
                                    "delete",
                                    "update"
                                ],
                                "identityClaim": "cognito:username"
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "TaskAssignee": {
            "name": "TaskAssignee",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "role": {
                    "name": "role",
                    "isArray": false,
                    "type": {
                        "enum": "Role"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "task": {
                    "name": "task",
                    "isArray": false,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "taskId"
                    }
                },
                "assignee": {
                    "name": "assignee",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "assigneeId"
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "TaskAssignees",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTask",
                        "fields": [
                            "taskId",
                            "assigneeId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byAssignee",
                        "fields": [
                            "assigneeId",
                            "taskId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "COORDINATOR",
                                    "RIDER",
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Task": {
            "name": "Task",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "createdBy": {
                    "name": "createdBy",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "userCreatedTasksId"
                    }
                },
                "timeOfCall": {
                    "name": "timeOfCall",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timePickedUp": {
                    "name": "timePickedUp",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timeDroppedOff": {
                    "name": "timeDroppedOff",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timeCancelled": {
                    "name": "timeCancelled",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timeRejected": {
                    "name": "timeRejected",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "timeRiderHome": {
                    "name": "timeRiderHome",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                },
                "requesterContact": {
                    "name": "requesterContact",
                    "isArray": false,
                    "type": {
                        "nonModel": "AddressAndContactDetails"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "pickUpLocation": {
                    "name": "pickUpLocation",
                    "isArray": false,
                    "type": {
                        "model": "Location"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "pickUpLocationId"
                    }
                },
                "dropOffLocation": {
                    "name": "dropOffLocation",
                    "isArray": false,
                    "type": {
                        "model": "Location"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "dropOffLocationId"
                    }
                },
                "riderResponsibility": {
                    "name": "riderResponsibility",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "assignees": {
                    "name": "assignees",
                    "isArray": true,
                    "type": {
                        "model": "TaskAssignee"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "task"
                    }
                },
                "priority": {
                    "name": "priority",
                    "isArray": false,
                    "type": {
                        "enum": "Priority"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "deliverables": {
                    "name": "deliverables",
                    "isArray": true,
                    "type": {
                        "model": "Deliverable"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "taskDeliverablesId"
                    }
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "parentId"
                    }
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": {
                        "enum": "TaskStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Tasks",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byPickUpLocation",
                        "fields": [
                            "pickUpLocationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byDropOffLocation",
                        "fields": [
                            "dropOffLocationId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byStatus",
                        "queryField": "tasksByStatus",
                        "fields": [
                            "status"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "COORDINATOR",
                                    "RIDER",
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Location": {
            "name": "Location",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "listed": {
                    "name": "listed",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "contact": {
                    "name": "contact",
                    "isArray": false,
                    "type": {
                        "nonModel": "AddressAndContactDetails"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "ward": {
                    "name": "ward",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line1": {
                    "name": "line1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line2": {
                    "name": "line2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line3": {
                    "name": "line3",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "town": {
                    "name": "town",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "county": {
                    "name": "county",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "country": {
                    "name": "country",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "postcode": {
                    "name": "postcode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "what3words": {
                    "name": "what3words",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "tasksAsPickUp": {
                    "name": "tasksAsPickUp",
                    "isArray": true,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "pickUpLocation"
                    }
                },
                "tasksAsDropOff": {
                    "name": "tasksAsDropOff",
                    "isArray": true,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "dropOffLocation"
                    }
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "parentId"
                    }
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Locations",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Deliverable": {
            "name": "Deliverable",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "deliverableType": {
                    "name": "deliverableType",
                    "isArray": false,
                    "type": {
                        "model": "DeliverableType"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "deliverableTypeDeliverablesId"
                    }
                },
                "task": {
                    "name": "task",
                    "isArray": false,
                    "type": {
                        "model": "Task"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "association": {
                        "connectionType": "BELONGS_TO",
                        "targetName": "taskDeliverablesId"
                    }
                },
                "count": {
                    "name": "count",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "unit": {
                    "name": "unit",
                    "isArray": false,
                    "type": {
                        "enum": "DeliverableUnit"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "orderInGrid": {
                    "name": "orderInGrid",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "parentId"
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Deliverables",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN",
                                    "COORDINATOR",
                                    "RIDER"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "delete",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "DeliverableType": {
            "name": "DeliverableType",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "label": {
                    "name": "label",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "icon": {
                    "name": "icon",
                    "isArray": false,
                    "type": {
                        "enum": "DeliverableTypeIcon"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "defaultUnit": {
                    "name": "defaultUnit",
                    "isArray": false,
                    "type": {
                        "enum": "DeliverableUnit"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "deliverables": {
                    "name": "deliverables",
                    "isArray": true,
                    "type": {
                        "model": "Deliverable"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "deliverableTypeDeliverablesId"
                    }
                },
                "tags": {
                    "name": "tags",
                    "isArray": true,
                    "type": "String",
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "DeliverableTypes",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Tenant": {
            "name": "Tenant",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "referenceIdentifier": {
                    "name": "referenceIdentifier",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "admin": {
                    "name": "admin",
                    "isArray": false,
                    "type": {
                        "model": "User"
                    },
                    "isRequired": true,
                    "attributes": [],
                    "association": {
                        "connectionType": "HAS_ONE",
                        "associatedWith": "id",
                        "targetName": "tenantAdminId"
                    }
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "tenantAdminId": {
                    "name": "tenantAdminId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Tenants",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Vehicle": {
            "name": "Vehicle",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tenantId": {
                    "name": "tenantId",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "assignedUserID": {
                    "name": "assignedUserID",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": false,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "manufacturer": {
                    "name": "manufacturer",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "model": {
                    "name": "model",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dateOfManufacture": {
                    "name": "dateOfManufacture",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "dateOfRegistration": {
                    "name": "dateOfRegistration",
                    "isArray": false,
                    "type": "AWSDate",
                    "isRequired": false,
                    "attributes": []
                },
                "comments": {
                    "name": "comments",
                    "isArray": true,
                    "type": {
                        "model": "Comment"
                    },
                    "isRequired": false,
                    "attributes": [],
                    "isArrayNullable": true,
                    "association": {
                        "connectionType": "HAS_MANY",
                        "associatedWith": "parentId"
                    }
                },
                "disabled": {
                    "name": "disabled",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                },
                "updatedAt": {
                    "name": "updatedAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": [],
                    "isReadOnly": true
                }
            },
            "syncable": true,
            "pluralName": "Vehicles",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byTenantId",
                        "fields": [
                            "tenantId"
                        ]
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byAssignedUser",
                        "fields": [
                            "assignedUserID"
                        ]
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "read"
                                ]
                            },
                            {
                                "groupClaim": "cognito:groups",
                                "provider": "userPools",
                                "allow": "groups",
                                "groups": [
                                    "ADMIN"
                                ],
                                "operations": [
                                    "create",
                                    "read",
                                    "update"
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "Role": {
            "name": "Role",
            "values": [
                "USER",
                "COORDINATOR",
                "RIDER",
                "ADMIN"
            ]
        },
        "CommentVisibility": {
            "name": "CommentVisibility",
            "values": [
                "EVERYONE",
                "ME"
            ]
        },
        "Priority": {
            "name": "Priority",
            "values": [
                "HIGH",
                "MEDIUM",
                "LOW"
            ]
        },
        "DeliverableTypeIcon": {
            "name": "DeliverableTypeIcon",
            "values": [
                "BUG",
                "CHILD",
                "DOCUMENT",
                "EQUIPMENT",
                "OTHER"
            ]
        },
        "DeliverableUnit": {
            "name": "DeliverableUnit",
            "values": [
                "NONE",
                "LITRE",
                "MILLILITRE",
                "GRAM",
                "ITEM",
                "BOX"
            ]
        },
        "TaskStatus": {
            "name": "TaskStatus",
            "values": [
                "NEW",
                "ACTIVE",
                "PICKED_UP",
                "DROPPED_OFF",
                "CANCELLED",
                "REJECTED",
                "ABANDONED",
                "COMPLETED"
            ]
        },
        "Patch": {
            "name": "Patch",
            "values": [
                "NORTH",
                "WEST",
                "EAST",
                "SOUTH",
                "RELIEF",
                "AIR_AMBULANCE"
            ]
        }
    },
    "nonModels": {
        "Statistics": {
            "name": "Statistics",
            "fields": {
                "numCancelled": {
                    "name": "numCancelled",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numCompleted": {
                    "name": "numCompleted",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numDroppedOff": {
                    "name": "numDroppedOff",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numRejected": {
                    "name": "numRejected",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numAbandoned": {
                    "name": "numAbandoned",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numActive": {
                    "name": "numActive",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numPickedUp": {
                    "name": "numPickedUp",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numNew": {
                    "name": "numNew",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "numTest": {
                    "name": "numTest",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "AddressAndContactDetails": {
            "name": "AddressAndContactDetails",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "telephoneNumber": {
                    "name": "telephoneNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "mobileNumber": {
                    "name": "mobileNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "emailAddress": {
                    "name": "emailAddress",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "ward": {
                    "name": "ward",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line1": {
                    "name": "line1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line2": {
                    "name": "line2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "line3": {
                    "name": "line3",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "town": {
                    "name": "town",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "county": {
                    "name": "county",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "state": {
                    "name": "state",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "country": {
                    "name": "country",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "postcode": {
                    "name": "postcode",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "what3words": {
                    "name": "what3words",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "S3Object": {
            "name": "S3Object",
            "fields": {
                "bucket": {
                    "name": "bucket",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "key": {
                    "name": "key",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "region": {
                    "name": "region",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            }
        }
    },
    "version": "80201745af5ce2e8c7821fbcc3fea6d4"
};