import React from "react";
import { userRoles } from "../apiConsts";
import PropTypes from "prop-types";
import { Chip, Stack } from "@mui/material";
import * as models from "../models";

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
                        disabled={props.disabled}
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
                    disabled={props.disabled}
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
    value: PropTypes.arrayOf(PropTypes.oneOf(Object.values(models.Role))),
    exclude: PropTypes.arrayOf(PropTypes.oneOf(Object.values(models.Role))),
    onSelect: PropTypes.func,
    all: PropTypes.bool,
    disabled: PropTypes.bool,
};

UserRoleSelect.defaultProps = {
    value: [],
    exclude: [],
    onSelect: () => {},
    all: false,
    disabled: false,
};

export default UserRoleSelect;
