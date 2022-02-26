import React, { useEffect, useState } from "react";
import { Avatar, Chip } from "@mui/material";
import PropTypes from "prop-types";
import { generateS3Link } from "../amplifyUtilities";
import { DataStore } from "aws-amplify";
import * as models from "../models";

function UserChip(props) {
    let { profilePictureThumbnail, displayName } = props.user;
    const [thumbnail, setThumbnail] = useState(null);
    const [label, setLabel] = useState(displayName);

    async function getThumbnail() {
        if (profilePictureThumbnail && profilePictureThumbnail.key) {
            const profilePictureKey = profilePictureThumbnail.key;
            const result = await generateS3Link(profilePictureKey);
            setThumbnail(result);
        }
    }
    useEffect(() => getThumbnail(), [props.user]);

    async function setText() {
        console.log(props.user);
        if (props.showResponsibility && props.user.userRiderResponsibilityId) {
            const riderResponsibility = await DataStore.query(
                models.RiderResponsibility,
                props.user.userRiderResponsibilityId
            );
            setLabel(`${displayName} (${riderResponsibility.label})`);
        } else {
            setLabel(displayName);
        }
    }
    useEffect(() => setText(), [props.showResponsibility]);

    if (thumbnail) {
        return (
            <Chip
                onClick={props.onClick}
                variant={props.variant}
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
    showResponsibility: PropTypes.bool,
};

UserChip.defaultProps = {
    onClick: () => {},
    onDelete: null,
    variant: "default",
    color: "default",
    showResponsibility: false,
};

export default UserChip;
