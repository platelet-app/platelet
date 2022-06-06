import _ from "lodash";
import { commentVisibility } from "../../../apiConsts";
import * as models from "../../../models";

async function generateMultipleTaskComments(selectedItems, body, author) {
    if (!selectedItems || _.isEmpty(selectedItems) || !body || !author) return;
    return await Promise.all(
        Object.values(selectedItems).map(async (item) => {
            return new models.Comment({
                body: body,
                parentId: item.id,
                visibility: commentVisibility.everyone,
                author: author,
            });
        })
    );
}

export default generateMultipleTaskComments;
