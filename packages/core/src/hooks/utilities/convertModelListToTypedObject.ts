import { PersistentModel } from "@aws-amplify/datastore";

const convertModelListToTypedObject = <T extends PersistentModel>(
    list: T[]
): Record<string, T> => {
    return list.reduce((acc, item) => {
        return {
            ...acc,
            [item.id]: item,
        };
    }, {});
};

export default convertModelListToTypedObject;
