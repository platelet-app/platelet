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
                        color={
                            props.value.includes(value) ? "primary" : "default"
                        }
                        key={value}
                        variant={
                            props.value.includes(value) ? "default" : "outlined"
                        }
                    />
                ))}
            {props.all && (
                <Chip
                    onClick={() => handleChange("ALL")}
                    label={"ALL"}
                    color={props.value.includes("ALL") ? "primary" : "default"}
                    key={"ALL"}
                    variant={
                        props.value.includes("ALL") ? "default" : "outlined"
                    }
                />
            )}
        </Stack>
    );
}

UserRoleSelect.propTypes = {
    value: PropTypes.arrayOf(Object.values(userRoles)),
    exclude: PropTypes.arrayOf(PropTypes.oneOf(Object.values(userRoles))),
    onSelect: PropTypes.func,
    all: PropTypes.bool,
};

UserRoleSelect.defaultProps = {
    value: [],
    exclude: [],
    onSelect: () => {},
    all: false,
};

export default UserRoleSelect;
