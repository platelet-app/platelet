import { AmplifyApiGraphQlResourceStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiGraphQlResourceStackTemplate) {
	resources.models["TaskAssignee"].appsyncFunctions["MutationcreateTaskAssigneepostAuth1FunctionMutationcreateTaskAssigneepostAuth1Function.AppSyncFunction"].dataSourceName = "TaskTable";
}
