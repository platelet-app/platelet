import { AmplifyApiGraphQlResourceStackTemplate } from "@aws-amplify/cli-extensibility-helper";
import { overrideDataSourceByFileName } from "./overrideHelpers"; // <<== the helper file in this repo

export const override = (
    resources: AmplifyApiGraphQlResourceStackTemplate
) => {};
