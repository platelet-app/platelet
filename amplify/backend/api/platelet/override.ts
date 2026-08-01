import { AmplifyApiGraphQlResourceStackTemplate } from "@aws-amplify/cli-extensibility-helper";
import {
    addModelStackDependency,
    overrideDataSourceByFileName,
} from "./overrideHelpers";

export const override = (resources: AmplifyApiGraphQlResourceStackTemplate) => {
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
        "Mutation.createTaskAssignee.postAuth.2", // <== The name of your file (without the extension)
        "TaskAssignee", // <== The model that this resolver falls within
        "UserTable" // <== The new datasource that you want to use
    );
    // prevent a user being assigned to a vehicle if they are being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createVehicleAssignment.postAuth.2", // <== The name of your file (without the extension)
        "VehicleAssignment", // <== The model that this resolver falls within
        "UserTable" // <== The new datasource that you want to use
    );
    // prevent a user being assigned a possible rider responsibility if they are being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createPossibleRiderResponsibilities.postAuth.2", // <== The name of your file (without the extension)
        "PossibleRiderResponsibilities", // <== The model that this resolver falls within
        "UserTable" // <== The new datasource that you want to use
    );
    // prevent a task being created by a user who is being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createTask.postAuth.2",
        "Task",
        "UserTable"
    );
    // prevent a location being created by a user who is being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createLocation.postAuth.2",
        "Location",
        "UserTable"
    );
    // prevent a vehicle being created by a user who is being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createVehicle.postAuth.2",
        "Vehicle",
        "UserTable"
    );
    // prevent a task being created by a user who is being deleted
    overrideDataSourceByFileName(
        resources,
        "Mutation.createScheduledTask.postAuth.2",
        "ScheduledTask",
        "UserTable"
    );
    // the overrides above set DataSourceName as a plain string, so CloudFormation
    // can't infer cross-stack dependencies; without these the model stacks deploy
    // in parallel and fresh environments fail with "Data source not found"
    [
        "Comment",
        "TaskAssignee",
        "VehicleAssignment",
        "PossibleRiderResponsibilities",
        "Task",
        "Location",
        "Vehicle",
        "ScheduledTask",
    ].forEach((model) => {
        addModelStackDependency(resources, model, "User");
    });
    // TaskAssignee also uses TaskTable
    addModelStackDependency(resources, "TaskAssignee", "Task");
};
