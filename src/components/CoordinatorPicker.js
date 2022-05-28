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

function CoordinatorPicker(props) {
    const [availableUsers, setAvailableUsers] = useState([]);
    const [filteredCoordinatorSuggestions, setFilteredCoordinatorSuggestions] =
        useState([]);
    const [reset, setReset] = useState(false);

    const onSelect = (event, selectedItem) => {
        if (selectedItem) props.onSelect(selectedItem);
        // toggle reset so that the key changes and the coordinator select re-renders
        setReset((prevState) => !prevState);
    };
    async function getCoordinators() {
        try {
            const coords = await DataStore.query(models.User, (u) =>
                u.roles("contains", userRoles.coordinator)
            );
            setAvailableUsers(coords);
        } catch (e) {
            setAvailableUsers([]);
            console.log(e);
        }
    }
    useEffect(() => getCoordinators(), []);

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
        setFilteredCoordinatorSuggestions(filteredSuggestions);
    }, [availableUsers, props.exclude]);

    return (
        <div>
            <Autocomplete
                fullWidth
                key={reset}
                filterOptions={filterOptions}
                data-cy="combo-box-coordinators"
                options={filteredCoordinatorSuggestions}
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
                    return (
                        <Box component="li" {...props}>
                            <CompactUserCard
                                userUUID={option.id}
                                displayName={option.displayName}
                                profilePictureThumbnail={
                                    option.profilePictureThumbnail
                                }
                            />
                        </Box>
                    );
                }}
            />
        </div>
    );
}

CoordinatorPicker.defaultProps = {
    onSelect: () => {},
    label: "Search...",
    exclude: [],
    className: "",
};
CoordinatorPicker.propTypes = {
    onSelect: PropTypes.func,
    label: PropTypes.string,
    exclude: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium"]),
};

export default CoordinatorPicker;
