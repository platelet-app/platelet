import React from "react";
import { userRoles } from "../apiConsts";
import PropTypes from "prop-types";
import { Chip, Stack } from "@mui/material";

function UserRoleSelect(props) {
    const handleChange = (value) => {
        props.onSelect(value);
    };

    return (
        <Stack spacing={1} direction="row">
            {Object.values(userRoles)
                .filter((value) => !props.exclude.includes(value))
                .reverse()
                .map((value) => (
                    <Chip
                        onClick={() => handleChange(value)}
                        label={value}
                        color={props.value === value ? "primary" : "default"}
                        key={value}
                        variant={props.value === value ? "default" : "outlined"}
                    />
                ))}
        </Stack>
    );
}

UserRoleSelect.propTypes = {
    value: PropTypes.oneOf(Object.values(userRoles)),
    exclude: PropTypes.arrayOf(PropTypes.oneOf(Object.values(userRoles))),
    onSelect: PropTypes.func,
};

UserRoleSelect.defaultProps = {
    value: null,
    exclude: [],
    onSelect: () => {},
};

export default UserRoleSelect;
