import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import LabelItemPair from "../../../components/LabelItemPair";
import Divider from "@mui/material/Divider";
import { getWhoami } from "../../../redux/Selectors";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";

import ConfirmationDialog from "../../../components/ConfirmationDialog";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import VehicleEditNameDialog from "./VehicleEditNameDialog";
import VehicleEditDetailsDialog from "./VehicleEditDetailsDialog";

export const vehicleNameFields = {
    name: "Name",
};

export const vehicleDetailFields = {
    manufacturer: "Manufacturer",
    model: "Model",
};

export const vehicleDateFields = {
    dateOfManufacture: "Date of Manufacture",
    dateOfRegistration: "Date of Registration",
};

const editActions = {
    editName: "editName",
    editDetails: "editDetails",
};

function VehicleProfile(props) {
    const [editAction, setEditAction] = useState(null);
    const updateValues = useRef({});

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    const whoami = useSelector(getWhoami);

    let editNameToggle = <></>;
    let editDetailsToggle = <></>;
    if (whoami.roles && whoami.roles.includes("ADMIN")) {
        editNameToggle = (
            <EditModeToggleButton
            aria-label="Edit Vehicle Name"
                value={editAction === editActions.editName}
                onChange={(v) => setEditAction(v ? editActions.editName : null)}
            />
        );
        editDetailsToggle = (
            <EditModeToggleButton
            aria-label="Edit Vehicle Details"
                value={editAction === editActions.editDetails}
                onChange={(v) =>
                    setEditAction(v ? editActions.editDetails : null)
                }
            />
        );
    }

    let header = (
        <Typography variant="h5" noWrap align={"right"}>
            {props.vehicle.name ? props.vehicle.name : "No name."}
        </Typography>
    );

    let dialogContents = <></>;
    if (editAction === editActions.editName) {
        dialogContents = (
            <VehicleEditNameDialog
                values={props.vehicle}
                onChange={(values) => {
                    updateValues.current = values;
                }}
            />
        );
    } else if (editAction === editActions.editDetails) {
        dialogContents = (
            <VehicleEditDetailsDialog
                values={props.vehicle}
                onChange={(values) => {
                    updateValues.current = values;
                }}
            />
        );
    }

    const onCancel = () => {
        setEditAction(null);
    };

    const onConfirmation = () => {
        props.onUpdate(updateValues.current);
        updateValues.current = {};
        setEditAction(null);
    };

    return (
        <Stack spacing={3} direction={"column"}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                spacing={3}
            >
                {header}
                {editNameToggle}
            </Stack>
            <Divider />
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"top"}
                spacing={3}
            >
                <Typography fontWeight="bold">Vehicle detail</Typography>

                {editDetailsToggle}
            </Stack>

            <Stack justifyContent={"flex-end"} alignItems={"center"}>
                {Object.entries(vehicleDetailFields).map(([key, label]) => {
                    return (
                        <LabelItemPair key={key} label={label}>
                            <Typography noWrap align={"right"}>
                                {props.vehicle[key]}
                            </Typography>
                        </LabelItemPair>
                    );
                })}
            </Stack>
            <Stack>
                {Object.entries(vehicleDateFields).map(([key, label]) => {
                    return (
                        <LabelItemPair key={key} label={label}>
                            <Typography noWrap align={"right"}>
                                {props.vehicle[key]}
                            </Typography>
                        </LabelItemPair>
                    );
                })}
            </Stack>
            <ConfirmationDialog
                fullScreen={isSm}
                dialogTitle="Edit Vehicle Information"
                open={editAction !== null}
                onCancel={onCancel}
                onConfirmation={onConfirmation}
            >
                {dialogContents}
            </ConfirmationDialog>
        </Stack>
    );
}

VehicleProfile.propTypes = {
    onUpdate: PropTypes.func,
};

VehicleProfile.defaultProps = {
    onUpdate: () => {},
};

export default VehicleProfile;
