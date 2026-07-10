import { AmplifyApiGraphQlResourceStackTemplate } from "@aws-amplify/cli-extensibility-helper";
import { overrideDataSourceByFileName } from "./overrideHelpers";

export const override = (resources: AmplifyApiGraphQlResourceStackTemplate) => {
    // On a fresh deployment all model stacks are created in parallel. Several model stacks
    // contain functions that reference the UserTable AppSync data source (registered by the
    // User model stack), causing "Data source not found" errors. Adding explicit dependencies
    // ensures the User stack completes before those stacks start.
    const userModelStack = resources.models["User"]?.modelStack;
    if (userModelStack) {
        for (const modelName of [
            "Task",
            "Location",
            "PossibleRiderResponsibilities",
            "Vehicle",
            "ScheduledTask",
            "TaskAssignee",
            "VehicleAssignment",
            "Comment",
        ]) {
            resources.models[modelName]?.modelStack?.addDependsOn(userModelStack);
        }
    }

    // TaskAssignee.postAuth.2 also references TaskTable, so it must wait for Task too.
    const taskModelStack = resources.models["Task"]?.modelStack;
    if (taskModelStack) {
        resources.models["TaskAssignee"]?.modelStack?.addDependsOn(taskModelStack);
    }

    // prevent an assignment being made on a task if it is archived
    overrideDataSourceByFileName(
        resources,
        "Mutation.createTaskAssignee.postAuth.2", // <== The name of your file (without the extension)
        "TaskAssignee", // <== The model that this resolver falls within
        "TaskTable" // <== The new datasource that you want to use
    );
    // prevent a user from creating a comment for another user
    overrideDataSourceByFileName(
        resources,
        "Mutation.createComment.postAuth.2", // <== The name of your file (without the extension)
        "Comment", // <== The model that this resolver falls within
        "UserTable" // <== The new datasource that you want to use
    );
    // prevent a comment being created by a user who is being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createComment.postAuth.1",
        "Comment",
        "UserTable"
    );
    // prevent a user being assigned to a task if they are being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createTaskAssignee.postAuth.1", // <== The name of your file (without the extension)
        "TaskAssignee", // <== The model that this resolver falls within
        "UserTable" // <== The new datasource that you want to use
    );
    // prevent a user being assigned to a vehicle if they are being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createVehicleAssignment.postAuth.1", // <== The name of your file (without the extension)
        "VehicleAssignment", // <== The model that this resolver falls within
        "UserTable" // <== The new datasource that you want to use
    );
    // prevent a user being assigned a possible rider responsibility if they are being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createPossibleRiderResponsibilities.postAuth.1", // <== The name of your file (without the extension)
        "PossibleRiderResponsibilities", // <== The model that this resolver falls within
        "UserTable" // <== The new datasource that you want to use
    );
    // prevent a task being created by a user who is being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createTask.postAuth.1",
        "Task",
        "UserTable"
    );
    // prevent a location being created by a user who is being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createLocation.postAuth.1",
        "Location",
        "UserTable"
    );
    // prevent a vehicle being created by a user who is being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createVehicle.postAuth.1",
        "Vehicle",
        "UserTable"
    );
    // prevent a task being created by a user who is being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createScheduledTask.postAuth.1",
        "ScheduledTask",
        "UserTable"
    );
};
