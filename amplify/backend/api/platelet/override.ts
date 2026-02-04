import { AmplifyApiGraphQlResourceStackTemplate } from "@aws-amplify/cli-extensibility-helper";
import { overrideDataSourceByFileName } from "./overrideHelpers"; // <<== the helper file in this repo

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
};
