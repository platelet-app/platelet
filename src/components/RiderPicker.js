import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CompactUserCard from "./CompactUserCard";
import { DataStore } from "aws-amplify";
import { userRoles } from "../apiConsts";
import * as models from "../models/index";
import { Box } from "@mui/material";
import { matchSorter } from "match-sorter";

const filterOptions = (options, { inputValue }) => {
    return matchSorter(options, inputValue, { keys: ["displayName"] });
};

function RiderPicker(props) {
    const [availableUsers, setAvailableRiders] = useState([]);
    const [filteredRiderSuggestions, setFilteredRiderSuggestions] = useState(
        []
    );
    const onSelect = (event, selectedItem) => {
        if (selectedItem) props.onSelect(selectedItem);
    };

    async function getRiders() {
        const riders = (await DataStore.query(models.User)).filter(
            (u) =>
                u.roles.includes(userRoles.rider) &&
                !props.exclude.includes(u.id)
        );
        setAvailableRiders(riders);
    }

    useEffect(() => getRiders(), []);

    useEffect(() => {
        const filteredSuggestions = availableUsers.filter(
            (u) => !props.exclude.includes(u.id)
        );
        // const vehicleUsers = filteredSuggestions.filter(
        //     (user) => user.assigned_vehicles.length !== 0
        // );
        // const noVehicleUsers = filteredSuggestions.filter(
        //     (user) => user.assigned_vehicles.length === 0
        // );
        //const reorderedUsers = vehicleUsers.concat(noVehicleUsers);
        setFilteredRiderSuggestions(filteredSuggestions);
    }, [availableUsers, props.exclude]);

    return (
        <div>
            <Autocomplete
                disablePortal
                filterOptions={filterOptions}
                id="combo-box-riders"
                options={filteredRiderSuggestions}
                getOptionLabel={(option) => option.displayName}
                size={props.size}
                style={{ width: 230 }}
                onChange={onSelect}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={props.label || "Select"}
                        variant="outlined"
                        margin="none"
                    />
                )}
                renderOption={(props, option) => {
                    //const vehicleName =
                    //    option.assigned_vehicles &&
                    //    option.assigned_vehicles.length > 0
                    //        ? option.assigned_vehicles[
                    //              option.assigned_vehicles.length - 1
                    //          ].name
                    //        : "";

                    return (
                        <Box component="li" {...props}>
                            <CompactUserCard
                                userUUID={option.id}
                                displayName={option.displayName}
                                patch={option.riderResponsibility}
                                profilePictureURL={
                                    option.profilePictureThumbnailURL
                                }
                                vehicleName={"no"}
                            />
                        </Box>
                    );
                }}
            />
        </div>
    );
}

RiderPicker.defaultProps = {
    onSelect: () => {},
    label: "Select",
    exclude: [],
    className: "",
};
RiderPicker.propTypes = {
    onSelect: PropTypes.func,
    label: PropTypes.string,
    exclude: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium"]),
};

export default RiderPicker;
