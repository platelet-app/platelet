import React, { useEffect, useState } from "react";
import { Avatar, Chip } from "@mui/material";
import PropTypes from "prop-types";
import { generateS3Link } from "../amplifyUtilities";

function UserChip(props) {
    let { profilePictureThumbnail, displayName } = props.user;
    const [thumbnail, setThumbnail] = useState(null);
    const [label, setLabel] = useState(displayName);

    async function getThumbnail() {
        if (profilePictureThumbnail && profilePictureThumbnail.key) {
            try {
                const profilePictureKey = profilePictureThumbnail.key;
                const result = await generateS3Link(profilePictureKey);
                if (result) {
                    setThumbnail(result);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    useEffect(() => getThumbnail(), [props.user]);

    async function setText() {
        try {
            if (props.responsibility) {
                setLabel(`${displayName} (${props.responsibility})`);
            } else {
                setLabel(displayName);
            }
        } catch (error) {
            console.log(error);
            setLabel(displayName);
        }
    }
    useEffect(() => setText(), [props.responsibility, props.user]);

    if (thumbnail) {
        return (
            <Chip
                onClick={props.onClick}
                variant={props.variant}
                disabled={props.disabled}
                color={props.color}
                onDelete={props.onDelete}
                avatar={<Avatar alt={displayName} src={thumbnail} />}
                label={label}
            />
        );
    } else {
        return (
            <Chip
                onDelete={props.onDelete}
                variant={props.variant}
                disabled={props.disabled}
                color={props.color}
                onClick={props.onClick}
                label={label}
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
    responsibility: PropTypes.string,
    disabled: PropTypes.bool,
};

UserChip.defaultProps = {
    onClick: () => {},
    onDelete: null,
    variant: "default",
    color: "default",
    responsibility: null,
    disabled: false,
};

export default UserChip;
