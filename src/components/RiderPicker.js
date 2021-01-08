import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import {useSelector} from "react-redux";
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import CompactUserCard from "./CompactUserCard";
import Divider from "@material-ui/core/Divider";


function RiderPicker(props) {
    const availableUsers = useSelector(state => state.users.users);
    const [filteredRiderSuggestions, setFilteredRiderSuggestions] = useState([]);
    const onSelect = (event, selectedItem) => {
        if (selectedItem)
            props.onSelect(selectedItem);
    };

    useEffect(() => {
        const filteredSuggestions = Object.values(availableUsers).filter(u => u.roles.includes("rider"))
        const vehicleUsers = filteredSuggestions.filter(user => user.assigned_vehicles.length !== 0)
        const noVehicleUsers = filteredSuggestions.filter(user => user.assigned_vehicles.length === 0);
        const reorderedUsers = vehicleUsers.concat(noVehicleUsers);
        setFilteredRiderSuggestions(reorderedUsers);
    }, [availableUsers]);

    return (
        <div>
            <Autocomplete
                id="combo-box-riders"
                options={filteredRiderSuggestions}
                getOptionLabel={(option) => option.display_name}
                style={{width: 350}}
                renderInput={(params) => (
                    <TextField {...params} label={props.label} variant="outlined" margin="normal"/>
                )}
                onChange={onSelect}
                renderOption={(option, {inputValue}) => {
                    // const matches = match(option.display_name, inputValue);
                    //  const parts = parse(option.display_name, matches);
                    const vehicleName = (option.assigned_vehicles && option.assigned_vehicles.length > 0) ? option.assigned_vehicles[option.assigned_vehicles.length - 1].name : "";

                    return (
                        <div style={{width: "100%"}}>
                            <CompactUserCard userUUID={option.uuid}
                                             displayName={option.display_name}
                                             patch={option.patch}
                                             profilePictureURL={option.profile_picture_thumbnail_url}
                                             vehicleName={vehicleName}
                            />

                            <Divider/>
                        </div>
                    )
                }
                }/>
        </div>
    )
}

RiderPicker.defaultProps = {
    onSelect: () => {},
    label: "Select"
}
RiderPicker.propTypes = {
    onSelect: PropTypes.func,
    label: PropTypes.string
}

export default RiderPicker;
