import { Box, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useRef, useState } from "react";
import LocationEditNameDialog from "./LocationEditNameDialog";
import { useSelector } from "react-redux";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import { getWhoami } from "../../../redux/Selectors";
import PropTypes from "prop-types";
import { userRoles } from "../../../apiConsts";
import LabelItemPair from "../../../components/LabelItemPair";
import { useTheme } from "@mui/styles";

import ConfirmationDialog from "../../../components/ConfirmationDialog";
import LocationEditContactDialog from "./LocationEditContactDialog";
import LocationEditDetailsDialog from "./LocationEditDetailsDialog";

export const locationFields = {
    ward: "Ward",
    line1: "Line 1",
    line2: "Line 2",
    line3: "Line 3",
    town: "Town",
    county: "County",
    country: "Country",
    state: "State",
    postcode: "Postcode",
    // what3words: "What 3 Words",
};

export const locationContactFields = {
    name: "Name",
    emailAddress: "Email",
    telephoneNumber: "Telephone",
};

const actions = {
    editName: "editName",
    editDetails: "editDetails",
    editContact: "editContact",
};

function LocationProfile(props) {
    const [action, setAction] = useState(null);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const updateValues = useRef({});

    const whoami = useSelector(getWhoami);

    //function verifyUpdate() {
    //    // TODO: verify name is unique
    //    return true;
    //}

    const onCancel = () => {
        setAction(null);
    };

    const onConfirmation = () => {
        console.log("onConfirmation", updateValues.current);
        props.onUpdate(updateValues.current);
        updateValues.current = {};
        setAction(null);
    };

    let editNameToggle = <></>;
    if (whoami.roles) {
        if (whoami.roles.includes(userRoles.admin)) {
            editNameToggle = (
                <EditModeToggleButton
                    aria-label="Edit Location Name"
                    onChange={(v) => {
                        if (v) {
                            setAction(actions.editName);
                        }
                    }}
                />
            );
        }
    }

    let editAddressToggle = <div></div>;
    if (whoami.roles) {
        if (whoami.roles.includes(userRoles.admin)) {
            editAddressToggle = (
                <EditModeToggleButton
                    aria-label="Edit Location Details"
                    onChange={(v) => {
                        if (v) {
                            setAction(actions.editDetails);
                        }
                    }}
                />
            );
        }
    }

    let editContactToggle = <div></div>;
    if (whoami.roles) {
        if (whoami.roles.includes(userRoles.admin)) {
            editContactToggle = (
                <EditModeToggleButton
                    aria-label="Edit Location Contact"
                    onChange={(v) => {
                        if (v) {
                            setAction(actions.editContact);
                        }
                    }}
                />
            );
        }
    }

    let dialogContents = <></>;
    let dialogTitle = "";
    if (action === actions.editName) {
        dialogContents = (
            <LocationEditNameDialog
                values={{ name: props.location.name }}
                onChange={(v) => (updateValues.current = v)}
            />
        );
        dialogTitle = "Edit Location Name";
    } else if (action === actions.editContact) {
        if (props.location && props.location.contact) {
            dialogContents = (
                <LocationEditContactDialog
                    values={props.location.contact}
                    onChange={(v) => (updateValues.current = v)}
                />
            );
            dialogTitle = "Edit Location Contact";
        }
    } else if (action === actions.editDetails) {
        dialogContents = (
            <LocationEditDetailsDialog
                values={props.location}
                onChange={(v) => (updateValues.current = v)}
            />
        );
        dialogTitle = "Edit Location Details";
    }

    const header = (
        <Typography variant="h5" noWrap align={"right"}>
            {props.location.name}
        </Typography>
    );

    return (
        <Stack direction={"column"} spacing={3}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                {header}
                {editNameToggle}
            </Stack>
            <Divider />
            <Stack
                direction={"row-reverse"}
                justifyContent={"space-between"}
                alignItems={"top"}
            >
                {editAddressToggle}
                <Typography fontWeight="bold">Address</Typography>
            </Stack>
            <Box sx={{ width: "100%" }}>
                {Object.keys(locationFields).map((key) => {
                    return (
                        <Typography key={key} noWrap>
                            {props.location[key]}
                        </Typography>
                    );
                })}
            </Box>
            {props.location && props.location.contact && <Divider />}
            {props.location.contact && (
                <>
                    <Stack
                        direction={"row-reverse"}
                        justifyContent={"space-between"}
                        alignItems={"top"}
                    >
                        {editContactToggle}
                        <Typography fontWeight="bold">Contact</Typography>
                    </Stack>
                    <Box sx={{ width: "100%" }}>
                        {Object.entries(locationContactFields).map(
                            ([key, label]) => {
                                return (
                                    <LabelItemPair key={key} label={label}>
                                        <Typography noWrap align={"right"}>
                                            {props.location.contact[key]}
                                        </Typography>
                                    </LabelItemPair>
                                );
                            }
                        )}
                    </Box>
                </>
            )}
            <ConfirmationDialog
                fullScreen={isSm}
                dialogTitle={dialogTitle}
                open={action !== null}
                onCancel={onCancel}
                onConfirmation={onConfirmation}
            >
                {dialogContents}
            </ConfirmationDialog>
        </Stack>
    );
}

LocationProfile.propTypes = {
    onUpdate: PropTypes.func,
    location: PropTypes.object.isRequired,
};

LocationProfile.defaultProps = {
    onUpdate: () => {},
};

export default LocationProfile;
