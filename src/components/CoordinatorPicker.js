import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import CompactUserCard from "./CompactUserCard";
import Divider from "@mui/material/Divider";
import { DataStore } from "aws-amplify";
import { userRoles } from "../apiConsts";
import * as models from "../models/index";
import { Box } from "@mui/material";

function CoordinatorPicker(props) {
    const [availableCoordinators, setAvailableCoordinators] = useState([]);
    const [filteredCoordinatorSuggestions, setFilteredCoordinatorSuggestions] =
        useState([]);
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
                                patch={option.riderResponsibility}
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
