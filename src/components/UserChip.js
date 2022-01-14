import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { Avatar, Chip } from "@mui/material";
import PropTypes from "prop-types";

function UserChip(props) {
    const { profilePictureThumbnail, displayName } = props.user;
    const [thumbnail, setThumbnail] = useState(null);
    async function getThumbnail() {
        if (profilePictureThumbnail && profilePictureThumbnail.key) {
            const profilePictureKey = profilePictureThumbnail.key;
            const imgKey = profilePictureKey.split("/").reverse()[0];
            const imgVisibility = profilePictureKey.split("/")[0];

            const result = await Storage.get(imgKey, {
                level: imgVisibility,
            });
            setThumbnail(result);
        }
    }
    useEffect(() => getThumbnail(), [props.user]);
    if (thumbnail) {
        return (
            <Chip
                onClick={props.onClick}
                onDelete={props.onDelete}
                avatar={<Avatar alt={displayName} src={thumbnail} />}
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
