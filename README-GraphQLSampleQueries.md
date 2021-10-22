# GraphQL Sample Queries

These should be run on an empty local DB using `amplify mock` since we're forcing IDs for ease of tracing.  You might need to delete your `amplify/mock-data/dynamodb/fake_us-fake-1.db` to wipe your local DB.

## How to use this

Start your GraphQL backend with `amplify mock` and navigate to the GraphQL console, usually at `http://192.168.1.57:20002/`.  Copy and paste the below code and run each mutation or query starting at the bottom and moving up to the top.  These are just examples to show what is possible and to test the schema construction before moving to the UI updates.

```bash

query GetRiderTasks{
  getUser(id:"5678"){
    username
    tasksCoordinator{
      items{
        task{
          name
        }
      }
    }
    tasks{
      items{
        task{
          name
        }
      }
      
    }
  }
}

mutation AddUserAsCoord{
  createCoordinatorTasks(input: {
    coordinatorTasksTaskId:"3456",
    coordinatorTasksCoordinatorId: "5678"
  }) {
    id
  }
}

query GetTasksByCoord{
  getUser(id: "5678"){
    id
    name
    tasksCoordinator{
      items{
        task{
          name
        }
      }
    }
  }
}

#Get all the tasks assigned to a user
query GetUser{
  getUser(id:"98765"){
    username
    tasks{
      items{
        task{
          name
        }
      }
    }
  }
}

#Get all the users assigned to a task
query GetUsersPerTask{
  getTask(id: "12345"){
    id
    name
    riders{
      items{
        user {
          id
          username
        }
        
      }
    }
  }
}

#Add Bob to another task so he has 2 tasks assigned
#Shows many-to-many relationship
mutation AddBobToFirstTask{
  createUserTasks(input: {
    userTasksUserId: "98765",
    userTasksTaskId: "3456"
  }) {
    id
  }
}

mutation AddBobToTask{
  createUserTasks(input: {
    userTasksUserId: "98765",
    userTasksTaskId: "12345"
  }) {
    id
  }
}

#Add Jane to a task
mutation AddJaneToTask{
  createUserTasks(input: {
    userTasksUserId: "5678",
    userTasksTaskId: "12345"
  }) {
    id
  }
}

#Create another task
mutation CreateSecondTask{
  createTask(input: {
    id: "12345"
    name: "second task",
    status: NEW
  }){
    id
    name
  }
}

#Create a task
mutation CreateFirstTask{
  createTask(input: {
    id: "3456"
    name: "first task",
    status: NEW
  }){
    id
    name
  }
}

#Get the users in a group, and any tasks associated.
#Useful after you assign tasks to users
query GetGroupUsers{
  getGroup(id: "2222"){
    id
    name
    users{
      items{
       username
        id
        tasks{
          items{
            task {
              id
              name
            }
          }
        }
      }
    }
  }
}

#Add Bob to the group
mutation UpdateBobUser{
  updateUser(input: {
    id: "98765",
    userGroupId: "2222"
  }){
    id
    username
  }
}

#Create a user
mutation CreateBobUser{
  createUser(input: {
    id: "98765"
    username: "bob",
    displayName: "Bob Dole"
    active: 1
  }){
    id
    username
    displayName
  }
}

#Create a user
mutation CreateTomUser{
  createUser(input: {
    id: "7654"
    username: "tom",
    displayName: "Tom Sawyer"
    active: 1
  }){
    id
    username
    displayName
  }
}

#Create a user
mutation CreateJaneUser{
  createUser(input: {
    id: "5678"
    username: "jane",
    displayName: "Jane Happy"
    active: 1
  }){
    id
    username
    displayName
  }
}

#Create a group
mutation CreateSERVGroup{
  createGroup(input: {
    id: "2222",
    name: "SERV Hert and Beds"
  }) {
    id
  }
}
```