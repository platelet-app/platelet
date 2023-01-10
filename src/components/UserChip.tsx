import React, { useEffect, useState } from "react";
import { Avatar, Chip } from "@mui/material";
import { generateS3Link } from "../amplifyUtilities";
import * as models from "../models";

type UserChipProps = {
    user: models.User;
    onClick?: () => void;
    onDelete?: () => void;
    variant?: "filled" | "outlined" | undefined;
    color?:
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning"
        | undefined;
    showResponsibility?: boolean;
    disabled?: boolean;
};

const UserChip: React.FC<UserChipProps> = (props) => {
    let { profilePicture, displayName, riderResponsibility } = props.user;
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [label, setLabel] = useState(displayName);
    const getThumbnail = React.useCallback(async (profilePictureKey) => {
        if (profilePictureKey) {
            try {
                const result = await generateS3Link(profilePictureKey);
                if (result) {
                    setThumbnail(result);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }, []);

    useEffect(() => {
        if (profilePicture && profilePicture.key) {
            getThumbnail(profilePicture.key);
        }
    }, [props.user, getThumbnail, profilePicture]);

    const setText = React.useCallback(async () => {
        try {
            if (props.showResponsibility && riderResponsibility) {
                setLabel(`${displayName} (${riderResponsibility})`);
            } else {
                setLabel(displayName);
            }
        } catch (error) {
            console.log(error);
            setLabel(displayName);
        }
    }, [props.showResponsibility, displayName, riderResponsibility]);

    useEffect(() => {
        setText();
    }, [props.showResponsibility, props.user, setText]);

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
};

UserChip.defaultProps = {
    showResponsibility: false,
    disabled: false,
};

export default UserChip;
