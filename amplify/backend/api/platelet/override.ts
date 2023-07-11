import { AmplifyApiGraphQlResourceStackTemplate } from "@aws-amplify/cli-extensibility-helper";
import { overrideDataSourceByFileName } from "./overrideHelpers"; // <<== the helper file in this repo

export const override = (resources: AmplifyApiGraphQlResourceStackTemplate) => {
    overrideDataSourceByFileName(
        resources,
        "Mutation.createTaskAssignee.postAuth.2", // <== The name of your file (without the extension)
        "TaskAssignee", // <== The model that this resolver falls within
        "TaskTable" // <== The new datasource that you want to use
    );
    overrideDataSourceByFileName(
        resources,
        "Mutation.createComment.postAuth.2", // <== The name of your file (without the extension)
        "Comment", // <== The model that this resolver falls within
        "UserTable" // <== The new datasource that you want to use
    );
};
