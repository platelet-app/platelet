import { AmplifyApiGraphQlResourceStackTemplate } from "@aws-amplify/cli-extensibility-helper";

export const overrideDataSourceByFileName = (
    resources: AmplifyApiGraphQlResourceStackTemplate,
    resolverFileName: string,
    targetModelName: string,
    newDataSourceName: string
) => {
    const [typeName, fieldName, slotName, slotPlacement] =
        resolverFileName.split(".");
    overrideDataSource(
        resources,
        typeName as "Mutation" | "Query" | string,
        fieldName,
        slotName as
            | "init"
            | "preAuth"
            | "auth"
            | "postAuth"
            | "preDataLoad"
            | "postDataLoad"
            | "finish"
            | "preUpdate"
            | "postUpdate"
            | "preSubscribe",
        slotPlacement ? Number(slotPlacement) : "",
        targetModelName,
        newDataSourceName
    );
};

export const overrideDataSource = (
    resources: AmplifyApiGraphQlResourceStackTemplate,
    typeName: "Mutation" | "Query" | string,
    fieldName: string, //eg. createTodo
    slotName:
        | "init"
        | "preAuth"
        | "auth"
        | "postAuth"
        | "preDataLoad"
        | "postDataLoad"
        | "finish"
        | "preUpdate"
        | "postUpdate"
        | "preSubscribe",
    slotPlacement: number | "",
    targetModelName: string,
    newDataSourceName: string
) => {
    let functionName: string;

    if (typeof slotPlacement === "number") {
        //This is done because the actual file name value is 1 higher than its reference value in the CF template
        const adjustedSlotPlacement = slotPlacement - 1;

        functionName = `${typeName}${fieldName}${slotName}${adjustedSlotPlacement}Function${typeName}${fieldName}${slotName}${adjustedSlotPlacement}Function.AppSyncFunction`;
    } else {
        //If it is a DataResolverFn then uppercase the word.
        fieldName = fieldName[0].toUpperCase() + fieldName.slice(1);

        functionName = `${typeName}${fieldName}DataResolverFn${typeName}${fieldName}DataResolverFn.AppSyncFunction`;
    }

    if (
        resources.models[targetModelName] &&
        resources.models[targetModelName].appsyncFunctions
    ) {
        if (
            resources.models[targetModelName].appsyncFunctions[functionName] &&
            resources.models[targetModelName].appsyncFunctions[functionName]
                .dataSourceName
        ) {
            resources.models[targetModelName].appsyncFunctions[
                functionName
            ].dataSourceName = newDataSourceName;
        } else {
            throw Error(
                "The resolver named " +
                    [typeName, fieldName, slotName, slotPlacement]
                        .filter((value) => value)
                        .join(".") +
                    " has not been referenced by the CF template so its Data Source cannot be overridden."
            );
        }
    }
};

export const verifyResolverExistenceByFileName = (
    resources: AmplifyApiGraphQlResourceStackTemplate,
    resolverFileName: string,
    targetModelName
) => {
    const [typeName, fieldName, slotName, slotPlacement] =
        resolverFileName.split(".");

    verifyResolverExistence(
        resources,
        typeName as "Mutation" | "Query" | string,
        fieldName,
        slotName as
            | "init"
            | "preAuth"
            | "auth"
            | "postAuth"
            | "preDataLoad"
            | "postDataLoad"
            | "finish"
            | "preUpdate"
            | "postUpdate"
            | "preSubscribe",
        slotPlacement ? Number(slotPlacement) : "",
        targetModelName
    );
};

export const verifyResolverExistence = (
    resources: AmplifyApiGraphQlResourceStackTemplate,
    typeName: "Mutation" | "Query" | string,
    fieldName: string, //eg. createBusiness
    slotName:
        | "init"
        | "preAuth"
        | "auth"
        | "postAuth"
        | "preDataLoad"
        | "postDataLoad"
        | "finish"
        | "preUpdate"
        | "postUpdate"
        | "preSubscribe",
    slotPlacement: number | "",
    targetModelName: string
) => {
    let functionName: string;

    if (typeof slotPlacement === "number") {
        //This is done because the actual file name value is 1 higher than its reference value in the CF template
        const adjustedSlotPlacement = slotPlacement - 1;

        functionName = `${typeName}${fieldName}${slotName}${adjustedSlotPlacement}Function${typeName}${fieldName}${slotName}${adjustedSlotPlacement}Function.AppSyncFunction`;
    } else {
        //If it is a DataResolverFn then uppercase the word.
        fieldName = fieldName[0].toUpperCase() + fieldName.slice(1);

        functionName = `${typeName}${fieldName}DataResolverFn${typeName}${fieldName}DataResolverFn.AppSyncFunction`;
    }

    if (
        !resources.models[targetModelName] ||
        !resources.models[targetModelName].appsyncFunctions[functionName] ||
        !resources.models[targetModelName].appsyncFunctions[functionName]
            .dataSourceName
    ) {
        throw Error(
            "The resolver named " +
                [typeName, fieldName, slotName, slotPlacement]
                    .filter((value) => value)
                    .join(".") +
                " has not been referenced by the CF template and would have no effect."
        );
    }
};
