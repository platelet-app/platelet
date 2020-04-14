import React from "react";
import {StyledStrip} from "../css/common";
import {Link} from "react-router-dom";
import {encodeUUID} from "../utilities";

export default function UserCard(props) {
    return (
        <Link to={"/user/" + encodeUUID(props.user.uuid)}>
            <StyledStrip>
                {props.user.display_name}
            </StyledStrip>
        </Link>
    )
}