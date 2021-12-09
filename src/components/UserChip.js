import React from "react";
import { Avatar, Chip } from "@mui/material";
import PropTypes from "prop-types";

function UserChip(props) {
    const { profilePictureThumbnailURL, displayName } = props.user;
    if (profilePictureThumbnailURL) {
        return (
            <Chip
                onClick={props.onClick}
                onDelete={props.onDelete}
                avatar={
                    <Avatar
                        alt={displayName}
                        src={profilePictureThumbnailURL}
                    />
                }
                label={displayName}
            />
        );
    } else {
        return (
            <Chip
                onDelete={props.onDelete}
                onClick={props.onClick}
                label={displayName}
            />
        );
    }
}

UserChip.propTypes = {
    user: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
};

UserChip.defaultProps = {
    onClick: () => {},
    onDelete: null,
};

export default UserChip;
