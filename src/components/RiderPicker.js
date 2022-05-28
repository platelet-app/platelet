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
import { convertListDataToObject } from "../utilities";

const filterOptions = (options, { inputValue }) => {
    return matchSorter(options, inputValue, { keys: ["displayName"] });
};

function RiderPicker(props) {
    const [availableUsers, setAvailableUsers] = useState([]);
    const [filteredRiderSuggestions, setFilteredRiderSuggestions] = useState(
        []
    );
    const [reset, setReset] = useState(false);
    const onSelect = (event, selectedItem) => {
        if (selectedItem) props.onSelect(selectedItem);
        // toggle reset so that the key changes and the rider select re-renders
        setReset((prevState) => !prevState);
    };

    async function getRiders() {
        try {
            const users = await DataStore.query(models.User, (u) =>
                u.roles("contains", userRoles.rider)
            );
            setAvailableUsers(users);
        } catch (e) {
            console.log(e);
            setAvailableUsers([]);
        }
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
        <>
            <Autocomplete
                fullWidth
                key={reset}
                filterOptions={filterOptions}
                data-cy="combo-box-riders"
                options={filteredRiderSuggestions}
                getOptionLabel={(option) => option.displayName}
                size={props.size}
                onChange={onSelect}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={props.label}
                        size={"small"}
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
                                responsibility={
                                    option.riderResponsibility || ""
                                }
                                profilePictureThumbnail={
                                    option.profilePictureThumbnail
                                }
                            />
                        </Box>
                    );
                }}
            />
        </>
    );
}

RiderPicker.defaultProps = {
    onSelect: () => {},
    label: "Search...",
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
