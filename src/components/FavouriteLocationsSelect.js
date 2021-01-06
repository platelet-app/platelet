import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import {useSelector} from "react-redux";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {matchSorter} from "match-sorter"

const filterOptions = (options, { inputValue }) => {
    console.log(options, inputValue)
    matchSorter(options, inputValue);
}


function FavouriteLocationsSelect(props) {
    const availableLocations = useSelector(state => state.availableLocations.locations);
    const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState([]);
    const onSelect = (event, selectedItem) => {
        if (selectedItem)
            props.onSelect(selectedItem);
    };

    useEffect(() => {
        const filteredSuggestions = Object.values(availableLocations).map((location) => {
            if (location.name != null)
                return location
        });
        setFilteredLocationSuggestions(filteredSuggestions);
    }, [availableLocations]);

    return (
        <div>
            <Autocomplete
                id="combo-box-locations"
                filterOptions={filterOptions}
                options={filteredLocationSuggestions}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label={props.label || "Select"} variant="outlined" />}
                onChange={onSelect}
            />
        </div>
    );
}

FavouriteLocationsSelect.propTypes = {
    onSelect: PropTypes.func,
    label: PropTypes.string
}

export default FavouriteLocationsSelect;
