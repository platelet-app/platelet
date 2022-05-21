import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { matchSorter } from "match-sorter";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";

const filterOptions = (options, { inputValue }) => {
    return matchSorter(options, inputValue, { keys: ["name"] });
};

function FavouriteLocationsSelect(props) {
    const [availableLocations, setAvailableLocations] = useState([]);
    const locationModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Location;
    const onSelect = (event, selectedItem) => {
        if (selectedItem) props.onSelect(selectedItem);
    };

    async function getLocations() {
        const locations = await DataStore.query(models.Location, (l) =>
            l.listed("eq", 1)
        );
        setAvailableLocations(locations);
    }

    useEffect(() => getLocations(), [locationModelSynced]);

    return (
        <Autocomplete
            disablePortal
            fullWidth
            aria-label={props.label}
            filterOptions={filterOptions}
            options={availableLocations}
            getOptionLabel={(option) => option.name}
            size={"small"}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label}
                    variant="outlined"
                    margin="none"
                />
            )}
            onChange={onSelect}
        />
    );
}

FavouriteLocationsSelect.propTypes = {
    onSelect: PropTypes.func,
    label: PropTypes.string,
};
FavouriteLocationsSelect.defaultProps = {
    onSelect: () => {},
    label: "Search locations...",
};

export default FavouriteLocationsSelect;
