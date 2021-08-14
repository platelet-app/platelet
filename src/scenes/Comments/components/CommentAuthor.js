import React from "react";
import UserAvatar from "../../../components/UserAvatar";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import { encodeUUID } from "../../../utilities";
import { Tooltip } from "@material-ui/core";

const CommentAuthor = React.memo((props) => {
    return (
        <Tooltip title={props.displayName}>
            <Link
                style={{ textDecoration: "none" }}
                component={RouterLink}
                to={"/user/" + encodeUUID(props.uuid)}
            >
                <UserAvatar
                    userUUID={props.uuid}
                    displayName={props.displayName}
                    avatarURL={props.avatarURL}
                />
            </Link>
        </Tooltip>
    );
});

export default CommentAuthor;
