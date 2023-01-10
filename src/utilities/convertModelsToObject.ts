import { PersistentModel } from "@aws-amplify/datastore";

export type PersistentModelObjectType<T> = {
    [key: string]: T;
};

function convertModelsToObject<T extends PersistentModel>(list: T[]) {
    const result: PersistentModelObjectType<T> = {};
    for (const item of list) {
        result[item.id] = item;
    }
    return result;
}

export default convertModelsToObject;
