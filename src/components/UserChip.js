import React, { useEffect, useState } from "react";
import { Avatar, Chip } from "@mui/material";
import PropTypes from "prop-types";
import { generateS3Link } from "../amplifyUtilities";

function UserChip(props) {
    const { profilePictureThumbnail, displayName } = props.user;
    const [thumbnail, setThumbnail] = useState(null);

    async function getThumbnail() {
        if (profilePictureThumbnail && profilePictureThumbnail.key) {
            const profilePictureKey = profilePictureThumbnail.key;
            const result = await generateS3Link(profilePictureKey);
            setThumbnail(result);
        }
    }
    useEffect(() => getThumbnail(), [props.user]);

    if (thumbnail) {
        return (
            <Chip
                onClick={props.onClick}
                variant={props.variant}
                color={props.color}
                onDelete={props.onDelete}
                avatar={<Avatar alt={displayName} src={thumbnail} />}
                label={displayName}
            />
        );
    } else {
        return (
            <Chip
                onDelete={props.onDelete}
                variant={props.variant}
                color={props.color}
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
    variant: PropTypes.string,
    color: PropTypes.string,
};

UserChip.defaultProps = {
    onClick: () => {},
    onDelete: null,
    variant: "default",
    color: "default",
};

export default UserChip;
