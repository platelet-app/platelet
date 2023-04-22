import * as models from "../../models";

export const INIT_COMMENTS = "INIT_COMMENTS";

export function initComments() {
    return {
        type: INIT_COMMENTS,
    };
}

export const SET_COMMENTS = "SET_COMMENTS";

export type CommentsActionType = {
    type: string;
    comments: models.Comment[];
};

export function setComments(comments: CommentsActionType) {
    return {
        type: SET_COMMENTS,
        comments,
    };
}
