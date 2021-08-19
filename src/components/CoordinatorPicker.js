import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CompactUserCard from "./CompactUserCard";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    textBox: {
        background: "white",
        borderRadius: 10,
    },
});

function CoordinatorPicker(props) {
    const availableUsers = useSelector((state) => state.users.users);
    const [textBoxValue, setTextBoxValue] = useState(null);
    const [filteredCoordinatorSuggestions, setFilteredCoordinatorSuggestions] =
        useState([]);
    const onSelect = (event, selectedItem) => {
        if (selectedItem) props.onSelect(selectedItem);
        setTextBoxValue(null);
    };
    const classes = useStyles();

    useEffect(() => {
        const filteredSuggestions = Object.values(availableUsers).filter(
            (u) =>
                u.roles.includes("coordinator") &&
                !props.exclude.includes(u.uuid)
        );
        setFilteredCoordinatorSuggestions(filteredSuggestions);
    }, [availableUsers, props.exclude]);

    return (
        <div>
            <Autocomplete
                id="combo-box-coordinators"
                options={filteredCoordinatorSuggestions}
                value={textBoxValue}
                className={props.className}
                size={props.size}
                getOptionLabel={(option) => option.display_name}
                style={{ width: 300 }}
                renderInput={(params) => (
                    <TextField
                        className={classes.textBox}
                        autoFocus
                        {...params}
                        label={props.label}
                        variant="outlined"
                        margin="none"
                    />
                )}
                onChange={onSelect}
                renderOption={(option, { inputValue }) => {
                    return (
                        <div style={{ width: "100%" }}>
                            <CompactUserCard
                                userUUID={option.uuid}
                                displayName={option.display_name}
                                profilePictureURL={
                                    option.profile_picture_thumbnail_url
                                }
                            />

                            <Divider />
                        </div>
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
