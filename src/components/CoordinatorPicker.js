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
    const [availableCoordinators, setAvailableCoordinators] = useState([]);
    const onSelect = (event, selectedItem) => {
        if (selectedItem) props.onSelect(selectedItem);
    };
    async function getCoordinators() {
        const coords = (await DataStore.query(models.User)).filter(
            (u) =>
                u.roles.includes(userRoles.coordinator) &&
                !props.exclude.includes(u.id)
        );
        setAvailableCoordinators(coords);
    }

    useEffect(() => getCoordinators(), []);
    return (
        <div>
            <Autocomplete
                disablePortal
                filterOptions={filterOptions}
                id="combo-box-coordinators"
                options={availableCoordinators}
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
                    return (
                        <Box component="li" {...props}>
                            <CompactUserCard
                                userUUID={option.id}
                                displayName={option.displayName}
                                profilePictureURL={
                                    option.profilePictureThumbnailURL
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
    label: "Select",
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
