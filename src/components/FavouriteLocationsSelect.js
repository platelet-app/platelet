import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import {useSelector} from "react-redux";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {matchSorter} from "match-sorter"
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const filterOptions = (options, { inputValue }) => {
    return matchSorter(options, inputValue, {keys: ['name']});
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
                filterOptions={filterOptions}
                options={filteredLocationSuggestions}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                renderInput={(params) => (
                    <TextField {...params} label={props.label || "Select"} variant="outlined" margin="normal" />
                )}
                onChange={onSelect}
                renderOption={(option, { inputValue }) => {
                    const matches = match(option.name, inputValue);
                    const parts = parse(option.name, matches);

                    return (
                        <div>
                            {parts.map((part, index) => (
                                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                {part.text}
              </span>
                            ))}
                        </div>
                    );
                }}
            />
        </div>
    );
}

FavouriteLocationsSelect.propTypes = {
    onSelect: PropTypes.func,
    label: PropTypes.string
}
FavouriteLocationsSelect.defaultProps = {
    onSelect: () => {}
}

export default FavouriteLocationsSelect;
