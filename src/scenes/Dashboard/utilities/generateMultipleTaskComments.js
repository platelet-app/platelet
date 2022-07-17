import _ from "lodash";
import { commentVisibility } from "../../../apiConsts";
import * as models from "../../../models";

async function generateMultipleTaskComments(
    selectedItems,
    body,
    author,
    tenantId
) {
    if (!selectedItems || _.isEmpty(selectedItems) || !body || !author) return;
    if (!tenantId) throw new Error("TenantId is required");
    return await Promise.all(
        Object.values(selectedItems).map(async (item) => {
            return new models.Comment({
                body: body,
                parentId: item.id,
                visibility: commentVisibility.everyone,
                tenantId,
                author: author,
            });
        })
    );
}

export default generateMultipleTaskComments;
