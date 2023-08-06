import _ from "lodash";
import * as models from "../../../models";

async function generateMultipleTaskComments(
    selectedItems: models.Task[],
    body: string,
    author: models.User,
    tenantId: string
) {
    if (!selectedItems || _.isEmpty(selectedItems) || !body || !author)
        return [];
    if (!tenantId) throw new Error("TenantId is required");
    return await Promise.all(
        Object.values(selectedItems).map(async (item) => {
            return new models.Comment({
                body: body,
                parentId: item.id,
                visibility: models.CommentVisibility.EVERYONE,
                tenantId,
                author: author,
            });
        })
    );
}

export default generateMultipleTaskComments;
