import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import {useSelector} from "react-redux";
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import CompactUserCard from "./CompactUserCard";
import Divider from "@material-ui/core/Divider";
import AssignRiderCoordinatorPopover from "../scenes/Task/components/AssignRiderCoordinatorPopover";


function CoordinatorPicker(props) {
    const availableUsers = useSelector(state => state.users.users);
    const [filteredCoordinatorSuggestions, setFilteredCoordinatorSuggestions] = useState([]);
    const onSelect = (event, selectedItem) => {
        if (selectedItem)
            props.onSelect(selectedItem);
    };

    useEffect(() => {
        const filteredSuggestions = Object.values(availableUsers).filter(u => u.roles.includes("coordinator") && !props.exclude.includes(u.uuid))
        setFilteredCoordinatorSuggestions(filteredSuggestions);
    }, [availableUsers]);

    return (
        <div>
            <Autocomplete
                id="combo-box-coordinators"
                options={filteredCoordinatorSuggestions}
                getOptionLabel={(option) => option.display_name}
                style={{width: 350}}
                renderInput={(params) => (
                    <TextField {...params} label={props.label} variant="outlined" margin="normal"/>
                )}
                onChange={onSelect}
                renderOption={(option, {inputValue}) => {
                    // const matches = match(option.display_name, inputValue);
                    //  const parts = parse(option.display_name, matches);

                    return (
                        <div style={{width: "100%"}}>
                            <CompactUserCard userUUID={option.uuid}
                                             displayName={option.display_name}
                                             profilePictureURL={option.profile_picture_thumbnail_url}
                            />

                            <Divider/>
                        </div>
                    )
                }
                }/>
        </div>
    )
}

CoordinatorPicker.defaultProps = {
    onSelect: () => {},
    label: "Select",
    exclude: []
}
CoordinatorPicker.propTypes = {
    onSelect: PropTypes.func,
    label: PropTypes.string,
    exclude: PropTypes.arrayOf(PropTypes.string)
}

export default CoordinatorPicker;
