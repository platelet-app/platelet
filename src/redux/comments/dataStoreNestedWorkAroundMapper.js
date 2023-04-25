import { DataStore } from "aws-amplify";
import * as models from "../../models";

export default async function dataStoreNestedWorkAroundMapper(data = []) {
    return Promise.all(
        data.map(async (item) => {
            if (!item.userCommentsId) {
                return item;
            }
            const { userCommentsId, ...rest } = item;
            const author = userCommentsId
                ? await DataStore.query(models.User, userCommentsId)
                : null;
            return { ...rest, author };
        })
    );
}
